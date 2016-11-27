import { getDNSServersList } from '../../../state/server/dns-servers-list/selectors';
import {
	getStaticEntriesList,
	getStaticEntryByHostAndType
} from '../../../state/server/static-entries-list/selectors';

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

			Object.keys( hostData ).map( ( entryType ) => {
				if ( ! getStaticEntryByHostAndType( this.reduxStore.getState(), host, entryType ) ) {
					this.reduxStore.dispatch( {
						type: 'STATIC_ENTRIES_LIST_ADD',
						data: {
							host: host,
							destination: hostData[ entryType ].destination,
							type: entryType,
							ttl: hostData[ entryType ].ttl,
						}
					} );
				}
			} );
		} );

		currentStaticEntriesList.map( ( entry ) => {
			if ( ! message[ entry.host ] || ! message[ entry.host ][ entry.type ] ) {
				this.reduxStore.dispatch( {
					type: 'STATIC_ENTRIES_LIST_REMOVE',
					host: entry.host,
					entry_type: entry.type
				} );
			}
		} );
	},

	updateStaticEntriesList( socket ) {
		socket.emit( 'config:getStaticEntriesList' );
	}
};
