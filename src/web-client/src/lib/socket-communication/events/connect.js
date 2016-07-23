export default {
	connect() {
		this.reduxStore.dispatch( {
			type: 'SERVER_CONNECTION_STATUS',
			data: true
		} );
	}

};
