const dns = require( 'native-dns' );
const configManager = require( '../utils/config-manager' );

const io = require( 'socket.io' );
const http = require( 'http' );

class DnsServer {
	constructor( dnsClient ) {
		this.dnsClientInstance = dnsClient;
		this.serverInstance = this.startServer();
		this.startWebSocketServer();
	}

	startServer() {
		const server = dns.createServer();

		server.on( 'request', ( request, response ) => {
			this.handleRequest.call( this, request, response );
		} );

		server.on( 'error', function ( err ) {
			console.log( 'SERVER ERROR: ', err.stack );
		} );

		const port = configManager.get( 'server:port' );

		if ( ! port || port < 1024 ) {
			throw new Error( 'Invalid port or port less than 1024' );
		}

		server.serve( port );

		return server;
	}

	handleRequest( request, response ) {
		let parsedRequest = request.question[ 0 ];

		this.dnsClientInstance.query( parsedRequest, ( result ) => {
			result.map( ( entry ) => {
				response.answer.push( entry );
			} );

			console.log( 'Query Result: ', JSON.stringify( result ) );

			response.send();
		} );
	}

	startWebSocketServer() {

		const server = http.createServer().listen( 15554, '127.0.0.1' );
		const socket = io( server );

		socket.on( 'connection', ( socket ) => {
			socket.emit( 'server:connected', { hello: 'darkness', my: 'old friend' } );

			let counter = 0;

			setInterval( () => {
				socket.emit( 'server:updateCounter', { counter: counter++ } );
			}, 1000 );

		} );

		socket.on( 'client:event', ( data ) => {
			socket.broadcast.emit( 'client:response', { yourdata: data } );
		} );
	}
}

module.exports = DnsServer;
