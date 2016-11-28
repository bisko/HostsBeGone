export default {
	disconnect() {
		this.reduxStore.dispatch( {
			type: 'SERVER_CONNECTION_STATUS',
			data: false
		} );

		this.reduxStore.dispatch( {
			type: 'DNS_CONFIGURATION_RESET',
		} );
	}
};
