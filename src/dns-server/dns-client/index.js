import dns from 'native-dns';
import DnsCache from '../dns-cache';
import ipConfigManager from '../utils/ipconfig';
import configManager from '../utils/config-manager';
import { maxBy, some, get } from 'lodash';

const storedQueriesTimes = 1000;
const serverQueryTimes = {};

export default class DnsClient {
	serversList = {};
	staticEntries = {};
	staticEntriesEnabled = true;
	onlineStatus = 'online';

	constructor( callback = null ) {
		this.dnsCache = new DnsCache();
		this.loadServers();
		this.loadStaticEntriesFromConfig();

		if ( typeof callback === 'function' ) {
			callback( this );
		}

		setInterval( () => {
			this.refreshCache();
		}, 5 * 1000 );
	}

	loadServers() {
		this.serversList = {};
		this.loadServersFromConfig();

		const systemServers = ipConfigManager.getDHCPDNSservers();
		systemServers.forEach( ( server ) => {
			this.addServer( server, { permanent: false } );
		} );
	}

	updateOnlineStatus( status ) {
		if ( status === this.onlineStatus ) {
			return;
		}

		if ( status === 'online' ) {
			this.loadServers();
		}
		else {
			// TODO decide what to do when we go offline
		}

		this.onlineStatus = status;
	}

	getServersList() {
		return this.serversList;
	}

	addServer( serverName, config ) {
		if ( config.permanent === false && this.serversList[ serverName ] ) {
			// Do not overwrite already added static servers if they're set by a random DHCP server
			return;
		}
		this.serversList[ serverName ] = config;

		this.saveServersListToConfig();
	}

	deleteServer( serverName ) {
		if ( this.serversList[ serverName ] ) {
			delete this.serversList[ serverName ];
		}

		this.saveServersListToConfig();
	}

	loadServersFromConfig() {
		this.serversList = configManager.get( 'client:staticDNSServers' ) || {};

		console.log( this.serversList );
	}

	saveServersListToConfig() {
		const serversToSave = {};

		Object.keys( this.serversList ).forEach( ( server ) => {
			const serverConfig = this.serversList[ server ];

			if ( false !== serverConfig.permanent ) {
				serversToSave[ server ] = serverConfig;
			}
		} );

		configManager.set( 'client:staticDNSServers', serversToSave );
	}

	getServersListNames() {
		return Object.keys( this.serversList );
	}

	queryServer( serverName, query, callback ) {
		const start = Date.now();

		const messages = [];

		const req = new dns.Request( {
			question: query,
			server: { address: serverName, port: 53, type: 'udp' },
			timeout: 1500
		} );

		req.on( 'timeout', function() {
			//console.log( 'Timeout in making request' );
		} );

		req.on( 'message', function( err, answer ) {
			answer.answer.forEach( function( a ) {
				messages.push( a );
			} );
		} );

		req.on( 'end', function() {
			const delta = ( Date.now() ) - start;
			//console.log( serverName, 'Finished processing request: ' + delta.toString() + 'ms' );

			if ( ! serverQueryTimes[ serverName ] ) {
				serverQueryTimes[ serverName ] = [];
			}

			serverQueryTimes[ serverName ].push( delta );

			if ( serverQueryTimes[ serverName ].length > storedQueriesTimes ) {
				serverQueryTimes[ serverName ] = serverQueryTimes[ serverName ].slice( 0, storedQueriesTimes );
			}

			callback( messages );
		} );

		req.send();

		return req;
	}

	// TODO automatically adjust timeout window if server is slower to respond than expected. This will help in high-latency scenarios
	queryAllServers( query, callback ) {
		const serverNames = this.getServersListNames();
		let hasReturnedResult = false;

		const runningQueries = [];
		let finishedQueries = 0;

		//console.log( 'QUERY: ', JSON.stringify( query ) );

		serverNames.forEach( ( serverName ) => {
			runningQueries.push( this.queryServer( serverName, query, ( result ) => {
				finishedQueries ++;

				if ( result.length ) {
					if ( ! hasReturnedResult ) {
						this.dnsCache.updateCacheFromQuery( query, result );
						hasReturnedResult = true;

						// TODO DO not cancel queries to track server response time
						// runningQueries.map( ( qry ) => {
						// 	qry.cancel();
						// } );

						callback( this.prepareResultForServing( this.dnsCache.query( query ) || [] ) );
					}
				} else if ( finishedQueries === runningQueries.length && ! hasReturnedResult ) {
					callback( result );
				}
			} ) );
		} );
	}

	query( query, callback ) {
		const cacheResult = this.dnsCache.query( query );

		if ( ! cacheResult ) {
			this.queryAllServers( query, callback );
		} else {
			callback( this.prepareResultForServing( cacheResult ) );
		}
	}

	prepareResultForServing( entries ) {
		const result = [];
		entries.map( ( entry ) => {
			result.push( Object.assign( {}, entry, { ttl: Math.min( entry.ttl || 10, 10 ) } ) );
		} );

		return result;
	}

	getStaticEntries() {
		return this.staticEntries;
	}

	addStaticEntry( entry, nosave = false ) {
		if ( ! this.staticEntries[ entry.host ] ) {
			this.staticEntries[ entry.host ] = {};
		}

		this.staticEntries[ entry.host ][ entry.type ] = entry;

		this.dnsCache.removeStaticEntry( entry.host );

		this.updateStaticEntriesForHost( entry.host );

		if ( false === nosave ) {
			this.saveStaticEntriesToConfig();
		}
	}

	updateStaticEntriesForHost( host ) {
		if ( this.staticEntries[ host ] ) {
			Object.keys( this.staticEntries[ host ] ).map( ( entryType ) => {
				const entry = this.staticEntries[ host ][ entryType ];
				this.dnsCache.addStaticEntry( entry );
			} );
		}
	}

	removeStaticEntry( entry ) {
		if ( this.staticEntries[ entry.host ] && this.staticEntries[ entry.host ][ entry.type ] ) {
			delete this.staticEntries[ entry.host ][ entry.type ];
		}

		// clear out the host entry if there are no more records left
		if ( Object.keys( this.staticEntries[ entry.host ] ).length === 0 ) {
			delete this.staticEntries[ entry.host ];
		}

		this.dnsCache.removeStaticEntry( entry.host );
		this.updateStaticEntriesForHost( entry.host );

		this.saveStaticEntriesToConfig();
	}

	loadStaticEntriesFromConfig() {
		this.staticEntries = configManager.get( 'client:staticEntries' ) || {};

		if ( this.isStaticEntriesEnabled() ) {
			Object.keys( this.staticEntries ).map( ( host ) => {
				const entry = this.staticEntries[ host ];

				Object.keys( entry ).map( ( entryType ) => {
					this.addStaticEntry( entry[ entryType ], true );
				} );
			} );
		}
	}

	saveStaticEntriesToConfig() {
		configManager.set( 'client:staticEntries', this.staticEntries );
	}

	isStaticEntriesEnabled() {
		return configManager.get( 'client:staticEntriesEnabled' ) || false;
	}

	staticEntriesEnable() {
		configManager.set( 'client:staticEntriesEnabled', true );
		Object.keys( this.staticEntries ).map( ( host ) => {
			this.updateStaticEntriesForHost( host );
		} );
	}

	staticEntriesDisable() {
		Object.keys( this.staticEntries ).map( ( host ) => {
			this.dnsCache.removeStaticEntry( host );
		} );
		configManager.set( 'client:staticEntriesEnabled', false );
	}

	flushCache() {
		this.dnsCache.flushCache();
		this.loadStaticEntriesFromConfig();
	}

	getCacheSize() {
		return this.dnsCache.getCacheSize();
	}

	getCacheList() {
		return this.dnsCache.getCacheList();
	}

	refreshCache() {
		const cache = this.dnsCache.cache.hosts;

		let allEntries = [];
		Object.keys( cache ).forEach( ( hostName ) => {
			const hostEntries = cache[ hostName ].records;
			Object.keys( hostEntries ).forEach( ( entryType ) => {
				allEntries.push( { name: hostName, type: entryType, 'class': 1 } );
			} );
		} );

		const date = new Date().getTime();
		const entriesToRefresh = allEntries.filter( ( entry ) => {
			const lastUpdatedDate = get( maxBy( cache[ entry.name ].records[ entry.type ], 'last_update' ), 'last_update', 0 );
			const isStaticEntry = some( cache[ entry.name ].records[ entry.type ], ( entry ) => ( entry.static_entry ) );
			return date - lastUpdatedDate > 60 * 1000 && ! isStaticEntry;
		} );

		entriesToRefresh.forEach( ( entriesList ) => {
			console.log( 'Refreshing: ', JSON.stringify( entriesList ) );
			this.queryAllServers( entriesList, ( args ) => {
				console.log( 'Refreshed: ', JSON.stringify( args ) );
			} );

		} );
	}
}
