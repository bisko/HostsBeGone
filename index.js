let dnsClient = require('./src/dns-client');
let dnsServer = require( './src/dns-server' );
let dnsClientInstance = new dnsClient();
let ipConfigManager = require('./src/utils/ipconfig');


dnsClientInstance.addServer( '8.8.8.8', {} );
dnsClientInstance.addServer( '8.8.4.4', {} );
//dnsClientInstance.addServer( '208.67.222.222', {} );
//dnsClientInstance.addServer( '208.67.220.220', {} );
//dnsClientInstance.addServer( '4.2.2.1', {} );


dnsClientInstance.addStaticEntry({
	host: 'test.local',
	destination: '1.2.3.4',
	type: 'A',
	ttl: 2
});


dnsClientInstance.addStaticEntry({
	host: 'calypso.localhost',
	destination: '127.0.0.1',
	type: 'A',
	ttl: 2
});

dnsClientInstance.addStaticEntry({
	host: 'calypso.localhost',
	destination: '::1',
	type: 'AAAA',
	ttl: 5
});

let systemServers = ipConfigManager.getDHCPDNSservers();

systemServers.map((server) => {
	dnsClientInstance.addServer( server, {} );
});

// setup server
let dnsServerInstance = new dnsServer( dnsClientInstance );
