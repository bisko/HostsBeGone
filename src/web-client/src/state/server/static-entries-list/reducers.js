export default ( state = [], action ) => {
	switch ( action.type ) {
		case 'STATIC_ENTRIES_LIST_ADD':
			return [
				...state,
				action.data
			];

		case 'STATIC_ENTRIES_LIST_REMOVE':
			return state.filter( ( entry ) => {
				return entry.host != action.host || entry.type != action.entry_type;
			} );

		case 'STATIC_ENTRIES_LIST_UPDATE':
			return state.map( ( entry ) => {
				if ( entry.host === action.host && entry.type === action.entry_type ) {
					return action.data;
				}

				return entry;
			} );

		default:
			return state;
	}
};
