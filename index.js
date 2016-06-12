let dnsClient = require('./src/dns-client');

let dns = new dnsClient();

dns.addServer('8.8.8.8', {});
dns.addServer('8.8.4.4', {});
dns.addServer('208.67.222.222', {});
dns.addServer('208.67.220.220', {});
dns.addServer('4.2.2.1', {});


dns.queryAllServers({host:'bisko.be', record: 'a'});