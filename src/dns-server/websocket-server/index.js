import io from 'socket.io';
import http from 'http';

import connectEvents from './events/connection';
import configEvents from './events/config';
import serverEvents from './events/server'

export default class WebSocketServer {
	dnsServer = null;
	dnsClient = null;

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
			this.attachEventsToSocket( serverEvents, socketInstance, 'server' );
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

			if ( '' !== prefix ) {
				prefixedEventName = prefix + ':' + eventName;
			}

			console.log( prefixedEventName );

			socket.on( prefixedEventName, events[ eventName ].bind( this, socket ) );
		} );
	}
}
