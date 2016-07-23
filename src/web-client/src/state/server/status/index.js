export default ( state = [], action ) => {
	switch ( action.type ) {
		case 'SERVER_CONNECTION_STATUS':
			return {
				...state,
				connection_status: action.data
			};

		case 'SERVER_RUNNING_STATUS':
			return {
				...state,
				running_status: action.data
			};

		default:
			return state;
	}
};
