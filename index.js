let dnsClient = require('./src/dns-client');
let dnsServer = require( './src/dns-server' );
let dnsClientInstance = new dnsClient( ( clientInstance )=> {

	console.log(clientInstance);

	let dnsServerInstance = new dnsServer( clientInstance );
} );
