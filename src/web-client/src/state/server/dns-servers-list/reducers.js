export default ( state = [], action ) => {
	switch ( action.type ) {
		case 'DNS_SERVER_LIST_ADD':
			return [
				...state,
				action.server
			];

		case 'DNS_SERVER_LIST_REMOVE':
			return state.filter( ( server ) => {
				return server.id != action.serverId;
			} );

		case 'DNS_SERVER_LIST_UPDATE':
			return state.map( ( server ) => {
				if ( server.id === action.serverId ) {
					return action.server;
				}

				return server;
			} );

		case 'DNS_CONFIGURATION_RESET':
			return [];

		default:
			return state;
	}
};
