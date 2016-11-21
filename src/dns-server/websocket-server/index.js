const io = require( 'socket.io' );
const http = require( 'http' );

const connectEvents = require( './events/connection' );
const configEvents = require( './events/config' );

class WebSocketServer {
	constructor( dnsServerInstance, dnsClientInstance ) {
		this.dnsServer = dnsServerInstance;
		this.dnsClient = dnsClientInstance;
	}

	startWebSocketServer() {
		const server = http.createServer().listen( 15554, '127.0.0.1' );
		const socket = io( server, {} );

		socket.on( 'connection', ( socketInstance ) => {
			socketInstance.emit( 'server:connected', { success: true } );
			// TODO execute ON CONNECT events
			this.attachEventsToSocket( configEvents, socketInstance, 'config' );
		} );
	}

	attachEventsToSocket( events, socket = null, prefix = '' ) {
		if ( ! socket ) {
			socket = this.socket;
		}

		Object.keys( events ).map( ( eventName ) => {
			if ( 'function' !== typeof events[ eventName ] ) {
				return;
			}

			let prefixedEventName = eventName;

			if ( '' != prefix ) {
				prefixedEventName = prefix + ':' + eventName;
			}

			console.log( prefixedEventName );

			socket.on( prefixedEventName, events[ eventName ].bind( this, socket ) );
		} );
	}
}

module.exports = WebSocketServer;
