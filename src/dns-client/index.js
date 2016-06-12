let dns = require( 'native-dns' );

class DnsClient {

	constructor() {
		this.serversList = {};
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

	queryServer( serverName, query ) {

		var question = dns.Question( {
			name: query.host,
			type: query.record,
		} );

		var start = Date.now();

		var req = dns.Request( {
			question: question,
			server: { address: serverName, port: 53, type: 'udp' },
			timeout: 1000
		} );

		req.on( 'timeout', function () {
			console.log( 'Timeout in making request' );
		} );

		req.on( 'message', function ( err, answer ) {
			answer.answer.forEach( function ( a ) {
				console.log( serverName, a.address );
			} );
		} );

		req.on( 'end', function () {
			var delta = (Date.now()) - start;
			console.log( serverName, 'Finished processing request: ' + delta.toString() + 'ms' );
		} );

		req.send();

	}

	queryAllServers( query ) {

		let serverNames = this.getServersList();

		serverNames.map( ( serverName ) => {
			this.queryServer( serverName, query );
		} );
	}
}

module.exports = DnsClient;