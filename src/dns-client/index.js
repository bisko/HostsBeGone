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

		const question = dns.Question( {
			name: query.host,
			type: query.record,
		} );

		const start = Date.now();

		const messages = [];

		const req = new dns.Request( {
			question: question,
			server: { address: serverName, port: 53, type: 'udp' },
			timeout: 5000
		} );

		req.on( 'timeout', function () {
			console.log( 'Timeout in making request' );
		} );

		req.on( 'message', function ( err, answer ) {
			answer.answer.forEach( function ( a ) {

				// TODO properly gather all the answers and send them in bulk
				console.log( serverName, a.address );

				messages.push( a );
			} );
		} );

		req.on( 'end', function () {
			var delta = (Date.now()) - start;
			console.log( serverName, 'Finished processing request: ' + delta.toString() + 'ms' );

			// TODO add time stats here

			callback( messages );
		} );

		req.send();

	}

	queryAllServers( query, callback ) {

		const serverNames = this.getServersList();
		let hasReturnedResult = false;

		serverNames.map( ( serverName ) => {
			console.log( 'QUERY: ', serverName );
			this.queryServer( serverName, query, ( result ) => {
				if ( result ) {
					this.dnsCache.updateCacheFromQuery( query, result );

					if ( ! hasReturnedResult ) {
						hasReturnedResult = true;
						callback( result );
					}
				}
			} );
		} );
	}

	query( query, callback ) {

		query = this.sanitizeQuery(query);

		const cacheResult = this.dnsCache.query( query.host, query.record );

		console.log('--------------------------------------------');
		console.log(cacheResult);

		if ( ! cacheResult ) {
			this.queryAllServers( query, callback );
		}
		else {
			callback( cacheResult );
		}
	}

	sanitizeQuery( query ) {

		// TODO do a proper validation here

		if (!query.host) {
			throw new Error('Missing hostname in query');
		}

		if (!query.record) {
			query.record = 'A';
		}
		else {
			query.record = query.record.toUpperCase();
		}

		return query;
	}
}

module.exports = DnsClient;