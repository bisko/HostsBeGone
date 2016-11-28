const dns = require( 'native-dns' );
const DnsCache = require( '../dns-cache' );
const ipConfigManager = require( '../utils/ipconfig' );
const configManager = require( '../utils/config-manager' );

class DnsClient {

	constructor( callback = null ) {
		this.serversList = {};
		this.staticEntries = {};
		this.dnsCache = new DnsCache();

		this.loadServersFromConfig();

		const systemServers = ipConfigManager.getDHCPDNSservers();
		systemServers.map( ( server ) => {
			this.addServer( server, { permanent: false } );
		} );

		this.loadStaticEntriesFromConfig();

		if ( typeof callback === 'function' ) {
			callback( this );
		}
	}

	getServersList() {
		return this.serversList;
	}

	addServer( serverName, config ) {
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
	}

	saveServersListToConfig() {
		const serversToSave = {};

		Object.keys( this.serversList ).map( ( server )=> {
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
			console.log( 'Timeout in making request' );
		} );

		req.on( 'message', function( err, answer ) {
			answer.answer.forEach( function( a ) {
				messages.push( a );
			} );
		} );

		req.on( 'end', function() {
			const delta = ( Date.now() ) - start;
			console.log( serverName, 'Finished processing request: ' + delta.toString() + 'ms' );

			callback( messages );
		} );

		req.send();

		return req;
	}

	queryAllServers( query, callback ) {
		const serverNames = this.getServersListNames();
		let hasReturnedResult = false;

		const runningQueries = [];
		let finishedQueries = 0;

		serverNames.map( ( serverName ) => {
			runningQueries.push( this.queryServer( serverName, query, ( result ) => {
				finishedQueries++;

				if ( result.length ) {
					if ( ! hasReturnedResult ) {
						this.dnsCache.updateCacheFromQuery( query, result );
						hasReturnedResult = true;

						// TODO DO not cancel queries to track server response time
						// runningQueries.map( ( qry ) => {
						// 	qry.cancel();
						// } );

						callback( this.prepareResultForServing( this.dnsCache.query( query ) ) );
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
			Object.keys( this.staticEntries[ host ] ).map( ( entryType )=> {
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

		Object.keys( this.staticEntries ).map( ( host )=> {
			const entry = this.staticEntries[ host ];

			Object.keys( entry ).map( ( entryType )=> {
				this.addStaticEntry( entry[ entryType ], true );
			} );
		} );
	}

	saveStaticEntriesToConfig() {
		configManager.set( 'client:staticEntries', this.staticEntries );
	}

}

module.exports = DnsClient;
