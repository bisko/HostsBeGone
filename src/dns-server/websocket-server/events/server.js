export default {
	restart( socket ) {
		process.exit();
	},

	flushCache( socket ) {
		this.dnsClient.flushCache();
		socket.emit( 'server:cacheSize', this.dnsClient.getCacheSize() );
	},

	getCacheSize( socket ) {
		socket.emit( 'server:cacheSize', this.dnsClient.getCacheSize() );
	},

	getCacheList( socket ) {
		const cacheList = this.dnsClient.getCacheList();

		socket.emit( 'server:cacheListStart', null );
		cacheList.forEach( ( entry ) => {
			socket.emit( 'server:cacheListEntry', entry );
		} );
		socket.emit( 'server:cacheListEnd', null );
	},

	onlineStatusChanged( socket, data ) {
		this.dnsClient.updateOnlineStatus(data);
	}
};
