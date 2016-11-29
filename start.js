const spawn = require( 'child_process' ).spawn;
const osx = require( './src/platform-specific/macos' );

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

	// TODO improve output handling
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
}

function startWebClient() {
	const webClient = spawn( 'node', [ './web-client.js' ], {
		cwd: process.cwd(),
		uid: get_user_id()
	} );

	// TODO improve output handling
	webClient.stdout.on( 'data', ( data ) => {
		console.log( `[ WEB CLIENT OUTPUT ]: ${data}` );
	} );

	webClient.stderr.on( 'data', ( data ) => {
		console.log( `[ WEB CLIENT OUTPUT ] (ERROR): ${data}` );
	} );

	webClient.on( 'close', ( code ) => {
		console.log( 'Web client quit unexpectedly with code: ' + code + '. Restarting...' );
		startWebClient();
	} );
}

if ( ! is_root() ) {
	throw new Error( 'You should run the server as root!' );
}

process.on( 'SIGINT', () => {
	osx.resetFirewallRules();
	osx.restoreOriginalDNSServers();
	process.exit();
} );

startDNSserver();
startWebClient();
