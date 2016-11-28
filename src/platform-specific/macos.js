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

// TODO - proper detection and implementation! Right now it would flush all the rules in `pf`
const resetFirewallRules = () => {
	return runCommand( 'pfctl -F nat' ).trim();
};

const addPortForwarding = ( from, to ) => {

	if ( ! parseInt( from ) || ! parseInt( to ) ) {
		return;
	}
	try {
		runCommand(
			'echo "rdr pass inet proto udp from any to 127.0.0.1 port ' + from + ' -> 127.0.0.1 port ' + to + '" | sudo pfctl -ef -'
		);
	}
	catch ( e ) {
		console.log('Failed: ', e.message);
	}
};

module.exports = {
	getNetworkInterfaces,
	getCurrentDNSServers,
	setDNSServers,
	addPortForwarding,
	saveOriginalDNSServers,
	takeOverDNSServers,
	restoreOriginalDNSServers,
	resetFirewallRules,
};
