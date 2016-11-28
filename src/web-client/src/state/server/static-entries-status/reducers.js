export default ( state = false, action ) => {
	switch ( action.type ) {
		case 'STATIC_ENTRIES_STATUS_SET':
			return action.status;

		case 'DNS_CONFIGURATION_RESET':
			return 'disabled';

		default:
			return state;
	}
};
