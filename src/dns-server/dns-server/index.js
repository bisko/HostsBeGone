const dns = require( 'native-dns' );
const configManager = require( '../utils/config-manager' );
const WebSocketServer = require( '../websocket-server' );

class DnsServer {
	constructor( dnsClient ) {
		this.dnsClientInstance = dnsClient;
		this.serverInstance = this.startServer();
		this.webSocketServerInstance = this.startWebSocketServer();
	}

	startServer() {
		const server = dns.createServer();

		server.on( 'request', ( request, response ) => {
			this.handleRequest.call( this, request, response );
		} );

		server.on( 'error', ( err ) => {
			console.log( 'SERVER ERROR: ', err.stack );
		} );

		const port = configManager.get( 'server:port' ) || 15553;

		if ( ! port || port < 1024 ) {
			throw new Error( 'Invalid port or port less than 1024' );
		}

		server.serve( port );

		return server;
	}

	handleRequest( request, response ) {
		const parsedRequest = request.question[ 0 ];

		this.dnsClientInstance.query( parsedRequest, ( result ) => {
			result.map( ( entry ) => {
				response.answer.push( entry );
			} );

			console.log( 'Query Result: ', JSON.stringify( result ) );

			response.send();
		} );
	}

	startWebSocketServer() {
		const webSocketInstance = new WebSocketServer( this.serverInstance, this.dnsClientInstance );
		webSocketInstance.startWebSocketServer();

		return webSocketInstance;
	}
}

module.exports = DnsServer;
