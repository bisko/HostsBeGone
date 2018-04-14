const DNSClient = require( './dns-server/dns-client/index' );
const DNSServer = require( './dns-server/dns-server/index' );

new DNSClient( ( clientInstance )=> {
	new DNSServer( clientInstance );
} );
