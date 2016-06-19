const dns = require( 'native-dns' );
const configManager = require( '../utils/config-manager' );

var WebSocketServer = require('ws').Server;

class DnsServer {
	constructor( dnsClient ) {
		this.dnsClientInstance = dnsClient;
		this.serverInstance = this.startServer();
		this.startWebSocketServer();
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

		return server;
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

	startWebSocketServer() {
		let wss = new WebSocketServer({ port: 15554 });

		wss.on('connection', function connection(ws) {
			ws.on('message', function incoming(message) {
				console.log('received: %s', message);
			});

			ws.send('something');
		});
	}
}


module.exports = DnsServer;