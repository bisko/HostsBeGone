let dns = require( 'native-dns' );

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

		server.on( 'error', function ( err ) {
			console.log( err.stack );
		} );

		server.serve( 53 );
	}

	handleRequest( request, response ) {
		let parsedRequest = request.question[0];

		this.dnsClientInstance.query(parsedRequest, ( result ) => {

			console.log( 'QUERY RESULT: ', result );

			result.map( ( entry ) => {
				response.answer.push( entry );
			} );

			response.send();
		} );
	}
}


module.exports = DnsServer;