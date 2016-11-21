module.exports = {
	updateConfig( socket, message ) {

	},

	getConfig( socket, message ) {
		if ( ! message.configKey ) {

		}
		const configKey = message.configKey;
	},

	getDNSServersList( socket ) {
		socket.emit( 'config:DNSServersList', this.dnsClient.getServersList() );
	},

	addDNSServer( socket, data ) {
		socket.emit( 'config:updateDNSServersList', { success: true } );
	},

	deleteDNSServer( socket, message ) {
		this.dnsClient.deleteServer( message.server_id );
		socket.emit( 'config:updateDNSServersList', { success: true } );
	}
};
