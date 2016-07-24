export default {
	updateCounter( message ) {
		this.reduxStore.dispatch( {
			type: 'SERVER_UPDATE_COUNTER',
			data: message
		} );
	}

};
