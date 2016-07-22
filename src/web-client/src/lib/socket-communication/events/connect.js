export default {
	connect() {
		this.socket.emit( 'client:event', 'test string' );
	}

};
