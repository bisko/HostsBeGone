export default {
	connected( message ) {
		console.log( 'GREETINGS', message );
	},
	updateCounter( message ) {
		console.log( 'got new counter', message );
	}

};
