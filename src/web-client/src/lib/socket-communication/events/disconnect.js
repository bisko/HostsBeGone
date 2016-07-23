export default {
	disconnect() {
		this.reduxStore.dispatch( {
			type: 'SERVER_CONNECTION_STATUS',
			data: false
		} );
	}
};
