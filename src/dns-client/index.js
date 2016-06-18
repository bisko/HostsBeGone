let dns = require( 'native-dns' );
let dnsCache = require( '../dns-cache' );

class DnsClient {

	constructor() {

		this.serversList = {};
		this.dnsCache = new dnsCache();
	}

	addServer( serverName, config ) {
		this.serversList[ serverName ] = config;
	}

	removeServer( serverName ) {
		delete this.serversList[ serverName ];
	}

	getServersList() {
		return Object.keys( this.serversList );
	}

	getServerConfig( serverName ) {
		return this.serversList[ serverName ];
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

						callback( this.dnsCache.query( query ) );
					}
				}
				else {
					if (finishedQueries === runningQueries.length) {
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
			callback( cacheResult );
		}
	}


	addStaticEntry( entry ) {
		this.dnsCache.addStaticEntry( entry );
	}
}

module.exports = DnsClient;