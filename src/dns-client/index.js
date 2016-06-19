let dns = require( 'native-dns' );
let dnsCache = require( '../dns-cache' );
const ipConfigManager = require( '../utils/ipconfig' );
const configManager = require( '../utils/config-manager' );


class DnsClient {

	constructor( callback = null ) {

		this.serversList = {};
		this.staticEntries = {};
		this.dnsCache = new dnsCache();

		this.loadServersFromConfig();

		let systemServers = ipConfigManager.getDHCPDNSservers();
		systemServers.map( ( server ) => {
			this.addServer( server, { permanent: false } );
		} );


		this.loadStaticEntriesFromConfig();

		if ( typeof callback === 'function' ) {
			callback( this );
		}
	}

	addServer( serverName, config ) {
		this.serversList[ serverName ] = config;

		this.saveServersListToConfig();
	}

	removeServer( serverName ) {
		delete this.serversList[ serverName ];
	}

	loadServersFromConfig() {
		this.serversList = configManager.get( 'client:staticDNSServers' ) || {};
	}

	saveServersListToConfig() {

		let serversToSave = {};

		Object.keys( this.serversList ).map( ( server )=> {
			let serverConfig = this.serversList[ server ];

			if ( false !== serverConfig.permanent ) {
				serversToSave[ server ] = serverConfig;
			}
		} );

		configManager.set( 'client:staticDNSServers', serversToSave );

	}

	getServersList() {
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

		req.on( 'timeout', function () {
			console.log( 'Timeout in making request' );
		} );

		req.on( 'message', function ( err, answer ) {
			answer.answer.forEach( function ( a ) {
				messages.push( a );
			} );
		} );

		req.on( 'end', function () {
			var delta = (Date.now()) - start;
			console.log( serverName, 'Finished processing request: ' + delta.toString() + 'ms' );

			callback( messages );
		} );

		req.send();

		return req;

	}

	queryAllServers( query, callback ) {

		const serverNames = this.getServersList();
		let hasReturnedResult = false;

		let runningQueries = [];
		let finishedQueries = 0;

		serverNames.map( ( serverName ) => {
			runningQueries.push( this.queryServer( serverName, query, ( result ) => {

				finishedQueries++;

				if ( result.length ) {
					this.dnsCache.updateCacheFromQuery( query, result );

					if ( ! hasReturnedResult ) {
						hasReturnedResult = true;

						runningQueries.map((query)=>{
							query.cancel();
						});

						callback( this.prepareResultForServing( this.dnsCache.query( query ) ) );
					}
				}
				else {
					if ( finishedQueries === runningQueries.length && ! hasReturnedResult ) {
						callback(result);
					}
				}
			} ) );
		} );
	}

	query( query, callback ) {

		const cacheResult = this.dnsCache.query( query );

		if ( ! cacheResult ) {
			this.queryAllServers( query, callback );
		}
		else {
			callback( this.prepareResultForServing( cacheResult ) );
		}
	}

	prepareResultForServing( entries ) {
		let result = [];

		entries.map( ( entry ) => {
			result.push( Object.assign( {}, entry, { ttl: Math.min( entry.ttl || 10, 10 ) } ) );
		} );

		return result;
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
				let entry = this.staticEntries[ host ][ entryType ];
				this.dnsCache.addStaticEntry( entry );
			} );
		}
	}

	removeStaticEntry( entry ) {

		if ( this.staticEntries[ entry.host ] && this.staticEntries[ entry.host ][ entry.type ] ) {
			delete this.staticEntries[ entry.host ][ entry.type ];
		}

		this.dnsCache.removeStaticEntry( entry.host );
		this.updateStaticEntriesForHost( entry.host );

		this.saveStaticEntriesToConfig();
	}

	loadStaticEntriesFromConfig() {
		this.staticEntries = configManager.get( 'client:staticEntries' ) || {};

		Object.keys( this.staticEntries ).map( ( host )=> {
			let entry = this.staticEntries[ host ];

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