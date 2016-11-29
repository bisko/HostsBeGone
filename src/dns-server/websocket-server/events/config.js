module.exports = {
	getDNSServersList( socket ) {
		socket.emit( 'config:DNSServersList', this.dnsClient.getServersList() );
	},

	addDNSServer( socket, data ) {
		// TODO validate DNS server
		this.dnsClient.addServer( data.server.address.host.trim(), data.server.options );
		socket.emit( 'config:updateDNSServersList', { success: true } );
	},

	deleteDNSServer( socket, message ) {
		this.dnsClient.deleteServer( message.serverId );
		socket.emit( 'config:updateDNSServersList', { success: true } );
	},

	getStaticEntriesList( socket ) {
		socket.emit( 'config:StaticEntriesList', this.dnsClient.getStaticEntries() );
	},

	addStaticEntry( socket, message ) {
		this.dnsClient.addStaticEntry( message.entry );
		socket.emit( 'config:updateStaticEntriesList', { success: true } );
	},

	deleteStaticEntry( socket, message ) {
		this.dnsClient.removeStaticEntry( { host: message.host, type: message.type } );
		socket.emit( 'config:updateStaticEntriesList', { success: true } );
	},

	getStaticEntriesStatus( socket ) {
		socket.emit( 'config:StaticEntriesStatus', { status: this.dnsClient.staticEntriesEnabled } );
	},

	disableStaticEntries( socket ) {
		this.dnsClient.staticEntriesDisable();
		socket.emit( 'config:updateStaticEntriesStatus' );
	},

	enableStaticEntries( socket ) {
		this.dnsClient.staticEntriesEnable();
		socket.emit( 'config:updateStaticEntriesStatus' );
	}
};
