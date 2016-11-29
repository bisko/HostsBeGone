const execSync = require( 'child_process' ).execSync;
let originalDNSServers = {};
let deviceMapping = {};

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
		let servers = getCurrentDNSServers( iface );
		if ( servers.length === 0 ) {
			/**
			 * In macOS, if there are no DNS servers set manually corresponds to the
			 * value `Empty` when setting the variable back
			 */
			servers = [ 'Empty' ];
		}
		originalDNSServers[ iface ] = servers;
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

const getNetworkDevicesMapping = () => {
	const deviceMappingOutput = runCommand( 'networksetup -listnetworkserviceorder | grep "Hardware Port:"' );

	deviceMapping = {};

	deviceMappingOutput.split( /\n/ ).map( ( line ) => {
		const matches = line.match( /Hardware Port: (.+), Device: (\w+)/ );

		if ( matches && matches.length ) {
			deviceMapping[ matches[ 2 ] ] = matches[ 1 ];
		}
	} );
};

const getActiveDevices = () => {
	const activeDevices = [];

	Object.keys( deviceMapping ).map( ( deviceId ) => {
		try {
			const output = runCommand( 'ifconfig ' + deviceId + ' 2> /dev/null | grep inet' );
			if ( output.length ) {
				activeDevices.push(
					deviceMapping[ deviceId ]
				);
			}
		} catch ( e ) {
			e.message = e.message + ''; // TODO this is a NOOP, because the IDE complains for empty blocks :)
		}
	} );

	return activeDevices;
};

const takeOverDNSServers = () => {
	saveOriginalDNSServers();
	getNetworkDevicesMapping();

	const activeDevices = getActiveDevices();

	activeDevices.map( ( device ) => {
		setDNSServers( device, [ '127.0.0.1' ] );
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
	} catch ( e ) {
		console.log( 'Failed: ', e.message );
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
