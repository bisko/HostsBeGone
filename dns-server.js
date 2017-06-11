const DNSClient = require( './src/dns-server/dns-client' );
const DNSServer = require( './src/dns-server/dns-server' );

new DNSClient( ( clientInstance )=> {
	new DNSServer( clientInstance );
} );
