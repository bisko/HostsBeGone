let dnsClient = require('./src/dns-client');
let dnsServer = require( './src/dns-server' );
new dnsClient( ( clientInstance )=> {
	new dnsServer( clientInstance );
} );


