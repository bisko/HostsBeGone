const spawn = require( 'child_process' ).spawn;
const osx = require( './src/platform-specific/macos' );
let serverProcess = null;
let clientProcess = null;

function is_root() {
	return process.getuid() === 0;
}

function get_user_id() {
	const sudo_uid = parseInt( process.env.SUDO_UID );

	if ( sudo_uid ) {
		return sudo_uid;
	}

	return process.getuid();
}

function startDNSserver() {
	osx.takeOverDNSServers();
	osx.resetFirewallRules();
	osx.addPortForwarding( 53, 15553 );

	const dnsServerProcess = spawn( 'node', [ './dns-server.js' ], {
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

	return dnsServerProcess;
}

function startWebClient() {
	const webClientProcess = spawn( 'node', [ './web-client.js' ], {
		cwd: process.cwd(),
		uid: get_user_id()
	} );

	webClientProcess.stdout.on( 'data', ( data ) => {
		console.log( `[ WEB CLIENT OUTPUT ]: ${data}` );
	} );

	webClientProcess.stderr.on( 'data', ( data ) => {
		console.log( `[ WEB CLIENT OUTPUT ] (ERROR): ${data}` );
	} );

	webClientProcess.on( 'close', ( code ) => {
		console.log( 'Web client quit unexpectedly with code: ' + code + '. Restarting...' );
		startWebClient();
	} );

	return webClientProcess;
}

if ( ! is_root() ) {
	throw new Error( 'You should run the server as root!' );
}

function stopServer() {
	osx.resetFirewallRules();
	osx.restoreOriginalDNSServers();

	serverProcess.kill( 'SIGTERM' );
	clientProcess.kill( 'SIGTERM' );

	process.exit();
}

process.on( 'SIGINT', stopServer );
process.on( 'SIGHUP', stopServer );
process.on( 'SIGTERM', stopServer );

serverProcess = startDNSserver();
clientProcess = startWebClient();
