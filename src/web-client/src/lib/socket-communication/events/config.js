import { getDNSServersList } from '../../../state/server/dns-servers-list/selectors';

export default {
	updateDNSServersList( socket ) {
		socket.emit( 'config:getDNSServersList' );
	},

	DNSServersList( socket, message ) {
		const currentServerList = getDNSServersList( this.reduxStore.getState() );

		Object.keys( message ).map( ( serverAddress ) => {
			if ( currentServerList.find( ( server ) => server.address === serverAddress ) ) {
				this.reduxStore.dispatch( {
					type: 'DNS_SERVER_LIST_UPDATE',
					serverId: serverAddress,
					server: {
						id: serverAddress,
						address: serverAddress,
						options: message[ serverAddress ]
					}
				} );
			} else {
				this.reduxStore.dispatch( {
					type: 'DNS_SERVER_LIST_ADD',
					server: {
						id: serverAddress,
						address: serverAddress,
						options: message[ serverAddress ]
					}
				} );
			}
		} );

		currentServerList.map( ( server ) => {
			if ( ! message[ server.address ] ) {
				this.reduxStore.dispatch( {
					type: 'DNS_SERVER_LIST_REMOVE',
					serverId: server.id
				} );
			}
		} );
	}
};
