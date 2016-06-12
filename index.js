let dnsClient = require('./src/dns-client');
let dnsServer = require( './src/dns-server' );
let dnsClinetInstance = new dnsClient();

dnsClinetInstance.addServer( '8.8.8.8', {} );
dnsClinetInstance.addServer( '8.8.4.4', {} );
dnsClinetInstance.addServer( '208.67.222.222', {} );
dnsClinetInstance.addServer( '208.67.220.220', {} );
dnsClinetInstance.addServer( '4.2.2.1', {} );


// setup server
let dnsServerInstance = new dnsServer( dnsClinetInstance );
