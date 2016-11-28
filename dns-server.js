const dnsClient = require('./src/dns-server/dns-client');
const dnsServer = require( './src/dns-server/dns-server' );
new dnsClient( ( clientInstance )=> {
	new dnsServer( clientInstance );
} );
