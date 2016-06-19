const dns = require( 'native-dns' );
const configManager = require( '../utils/config-manager' );

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
			console.log('SERVER ERROR: ', err.stack );
		} );

		let port = configManager.get('server:port');

		if (!port || port < 1024) {
			throw new Error('Invalid port or port less than 1024')
		}

		server.serve( port );
	}

	handleRequest( request, response ) {
		let parsedRequest = request.question[0];

		this.dnsClientInstance.query(parsedRequest, ( result ) => {
			result.map( ( entry ) => {
				response.answer.push( entry );
			} );

			response.send();
		} );
	}
}


module.exports = DnsServer;