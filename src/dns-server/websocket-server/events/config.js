module.exports = {
	updateConfig( socket, message ) {

	},

	getConfig( socket, message ) {
		if ( ! message.configKey ) {

		}
		const configKey = message.configKey;
	},

	getDNSServersList( socket, message ) {
		console.log('getDNSServersList');
		socket.emit( 'config:DNSServersList', this.dnsClient.getServersList() );
	},

	deleteDNSServer( socket, message ) {
		this.dnsClient.deleteServer( message.server_id );
		socket.emit( 'config:updateDNSServersList', { success: true } );
	}
};
