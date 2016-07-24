export default ( state = {}, action ) => {
	switch ( action.type ) {
		case 'SERVER_UPDATE_COUNTER':
			return {
				...state,
				server_counter: action.data.counter,
			};
		default:
			return state;
	}
};
