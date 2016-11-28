import io from 'socket.io-client';

import connectEvents from './events/connect';
import disconnectEvents from './events/disconnect';
import serverEvents from './events/server';
import configEvents from './events/config';

class SocketCommunication {
	constructor( reduxStore ) {
		this.socket = null;
		this.reduxStore = reduxStore;
	}

	start() {
		if ( ! window.io ) {
			this.socket = io.connect( 'http://127.0.0.1:15554' );
			window.io = this.socket;

			this.attachEventsToSocket( connectEvents );
			this.attachEventsToSocket( disconnectEvents );
			this.attachEventsToSocket( serverEvents, null, 'server' );
			this.attachEventsToSocket( configEvents, null, 'config' );
		}
	}

	stop() {
		if (this.socket) {
			this.socket.disconnect();
		}
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

			socket.on( prefixedEventName, events[ eventName ].bind( this, socket ) );
		} );
	}

	dispatch( event, data ) {
		return this.socket.emit( event, data );
	}
}

export default SocketCommunication;
