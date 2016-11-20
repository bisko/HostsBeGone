export default ( state = [], action ) => {
	switch ( action.type ) {
		case 'DNS_SERVER_LIST_ADD':
			return [
				...state,
				action.server
			];

		case 'DNS_SERVER_LIST_REMOVE':
			return state.filter( ( server ) => {
				return server.id != action.server_id;
			} );

		case 'DNS_SERVER_LIST_UPDATE':
			return state.map( ( server ) => {
				if ( server.id === action.server_id ) {
					return action.server;
				}

				return server;
			} );

		default:
			return state;
	}
};
