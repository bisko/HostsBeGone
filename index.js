let dnsClient = require('./src/dns-server/dns-client');
let dnsServer = require( './src/dns-server/dns-server' );
new dnsClient( ( clientInstance )=> {
	new dnsServer( clientInstance );
} );
