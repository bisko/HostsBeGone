import { getDNSServersList } from '../../../state/server/dns-servers-list/selectors';
import { getStaticEntriesList } from '../../../state/server/static-entries-list/selectors';

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
	},

	StaticEntriesList( socket, message ) {
		const currentStaticEntriesList = getStaticEntriesList( this.reduxStore.getState() );

		Object.keys( message ).map( ( host ) => {
			const hostData = message[ host ];

			if ( ! hostData.A ) {
				delete currentStaticEntriesList[ host ];
				return null;
			}

			if ( currentStaticEntriesList.find( ( entry ) => entry.host === host ) ) {
				this.reduxStore.dispatch( {
					type: 'STATIC_ENTRIES_LIST_UPDATE',
					data: {
						host: host,
						destination: hostData.A.destination,
						type: hostData.A.type
					}
				} );
			} else {
				this.reduxStore.dispatch( {
					type: 'STATIC_ENTRIES_LIST_ADD',
					data: {
						host: host,
						destination: hostData.A.destination,
						type: hostData.A.type
					}
				} );
			}
		} );

		currentStaticEntriesList.map( ( entry ) => {
			if ( ! message[ entry.host ] || ! message[ entry.host ].A ) {
				this.reduxStore.dispatch( {
					type: 'STATIC_ENTRIES_LIST_REMOVE',
					host: entry.host
				} );
			}
		} );
	},

	updateStaticEntriesList( socket ) {
		socket.emit( 'config:getStaticEntriesList' );
	}
};
