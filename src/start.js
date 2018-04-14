const Service = require( 'node-mac' ).Service;
const path = require( 'path' );

try {
	process.chdir( __dirname );
} catch ( e ) {
	console.error( 'Unable to change directory, still in: ', process.cwd() );
}

const spawn = require( 'child_process' ).spawn;
const osx = require( './platform-specific/macos' );

let serverProcess = null;

function is_root() {
	return process.getuid() === 0;
}

function get_user_id() {
	const sudo_uid = parseInt( process.env.SUDO_UID );

	if ( sudo_uid ) {
		return sudo_uid;
	}

	/**
	 * TODO: TEMPORARY! Runs the server as the first user in OS X.
	 *
	 * This will be improved later, when a proper service install code is put in place.
	 * It should save the ID of the user that installed the service in the config file.
	 *
	 * Another possible solution is to check who's the owner of the folder the script is in and
	 * run as this user.
 	 */
	return 501;

	return process.getuid();
}

function startDNSserver() {
	osx.takeOverDNSServers();
	osx.resetFirewallRules();
	osx.addPortForwarding( 53, 15553 );

	const dnsServerProcess = spawn( process.argv[ 0 ], [ path.join( __dirname, 'dns-server-init.js' ) ], {
		cwd: process.cwd(),
		uid: get_user_id()
	} );

	dnsServerProcess.stdout.on( 'data', ( data ) => {
		console.log( `[ DNS SERVER OUTPUT ]: ${data}` );
	} );

	dnsServerProcess.stderr.on( 'data', ( data ) => {
		console.log( `[ DNS SERVER OUTPUT ] (ERROR): ${data}` );
	} );

	dnsServerProcess.on( 'close', ( code ) => {
		console.log( 'DNS server quit unexpectedly with code: ' + code + '. Restarting...' );
		osx.restoreOriginalDNSServers();
		startDNSserver();
	} );

	dnsServerProcess.on( 'error', ( err ) => {
		console.log( 'SERVER ERROR: ', err );
	} );

	dnsServerProcess.on( 'uncaughtException', ( ex ) => {
		console.log( 'SERVER UNCAUGHT EXCEPTION: ', ex );
	} );

	return dnsServerProcess;
}

if ( ! is_root() ) {
	throw new Error( 'You should run the server as root!' );
}

function stopServer() {
	osx.resetFirewallRules();
	osx.restoreOriginalDNSServers();
	if ( serverProcess ) {
		serverProcess.kill( 'SIGTERM' );
	}

	process.exit();
}

function initServers() {
	process.on( 'SIGINT', stopServer );
	process.on( 'SIGHUP', stopServer );
	process.on( 'SIGTERM', stopServer );

	process.on( 'uncaughtException', ( ex ) => {
		console.error( 'PARENT Uncaught exception: ', ex );
	} );

	serverProcess = startDNSserver();
}

const dnsService = new Service( {
	name: 'Hosts Be Gone',
	description: 'A local DNS server.',
	script: path.join( __dirname, 'start.js' ),
	wait: 2,
	grow: .5,
	maxRetries: 2,
} );

dnsService.on( 'install', () => {
	dnsService.start();
} );

dnsService.on( 'start', initServers );
dnsService.on( 'stop', stopServer );

if ( ! dnsService.exists ) {
	dnsService.install();
} else {
	dnsService.start();
}
