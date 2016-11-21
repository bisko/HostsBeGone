module.exports = {
	getDNSServersList( socket ) {
		socket.emit( 'config:DNSServersList', this.dnsClient.getServersList() );
	},

	addDNSServer( socket, data ) {
		// TODO validate DNS server
		this.dnsClient.addServer( data.server.address.trim(), data.server.options );
		socket.emit( 'config:updateDNSServersList', { success: true } );
	},

	deleteDNSServer( socket, message ) {
		this.dnsClient.deleteServer( message.serverId );
		socket.emit( 'config:updateDNSServersList', { success: true } );
	}
};
