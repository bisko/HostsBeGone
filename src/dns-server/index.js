let dns = require( 'native-dns' ),
	consts = require( 'native-dns-packet' ).consts;

class DnsServer {
	constructor( dnsClient ) {
		this.dnsClientInstance = dnsClient;
		this.startServer();
	}

	startServer() {
		var server = dns.createServer();

		server.on( 'request', ( request, response ) => {
			this.handleRequest.call( this, request, response );
		} );

		server.on( 'error', function ( err, buff, req, res ) {
			console.log( err.stack );
		} );

		server.serve( 15353 );
	}

	handleRequest( request, response ) {
		/**
		 * Prepare request for our client
		 */

		//let parsedRequest = this.parseRequest( request );


		let parsedRequest = request.question[0];
		console.log(parsedRequest);

		this.dnsClientInstance.query(parsedRequest, ( result ) => {

			console.log( 'QUERY RESULT: ', result );

			result.map( ( entry ) => {
				response.answer.push( entry );
			} );

			/*
			 dns.A( {
			 name: entry.name,
			 address: entry.address,
			 ttl: 1
			 } )
			 */
			response.send();
		} );
	}

	parseRequest( request ) {
		return  {
			host: request.question[ 0 ].name,
			type: consts.qtypeToName(request.question[ 0 ].type) || 'A'
		};
	}
}


module.exports = DnsServer;