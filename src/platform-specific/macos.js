const execSync = require( 'child_process' ).execSync;
let originalDNSServers = {};

const runCommand = ( command ) => {
	return execSync( command, {
		cwd: process.cwd(),
	} ).toString();
};

const escapeShell = ( cmd ) => {
	return '"' + cmd.replace( /(["\s'$`\\])/g, '\\$1' ) + '"';
};

const getNetworkInterfaces = () => {
	const networkInterfaceList = runCommand( 'networksetup -listallnetworkservices' );

	return networkInterfaceList.trim().split( /\n/ ).filter( ( line ) => {
		return line.indexOf( '*' ) === - 1;
	} );
};

const saveOriginalDNSServers = () => {
	const interfaces = getNetworkInterfaces();

	originalDNSServers = {};

	interfaces.map( ( iface ) => {
		originalDNSServers[ iface ] = getCurrentDNSServers( iface );
	} );

	return originalDNSServers;
};

const getCurrentDNSServers = ( iface ) => {
	const dnsServersList = runCommand( 'networksetup -getdnsservers "' + escapeShell( iface ) + '"' ).trim();

	if ( ! dnsServersList ) {
		return null;
	}

	return dnsServersList.split( /\n/ ).filter( ( line ) => {
		return ( line.match( / / ) || [] ).length === 0;
	} ).map( ( line ) => {
		return line.trim();
	} );
};

const takeOverDNSServers = () => {
	Object.keys( originalDNSServers ).map( ( iface ) => {
		const dnsServers = originalDNSServers[ iface ];

		if ( ! dnsServers.length ) {
			return;
		}

		setDNSServers( iface, [ '127.0.0.1' ] );
	} );
};

const restoreOriginalDNSServers = () => {
	Object.keys( originalDNSServers ).map( ( iface ) => {
		const dnsServers = originalDNSServers[ iface ];
		if ( dnsServers.length ) {
			setDNSServers( iface, dnsServers );
		}
	} );
};

const setDNSServers = ( iface, servers ) => {
	return runCommand(
		'networksetup -setdnsservers "' + escapeShell( iface ) + '" ' + servers.join( ' ' )
	).trim();
};

const addPortForwarding = ( from, to ) => {

};

module.exports = {
	getNetworkInterfaces,
	getCurrentDNSServers,
	setDNSServers,
	addPortForwarding,
	saveOriginalDNSServers,
	takeOverDNSServers,
	restoreOriginalDNSServers
};
