import os from 'os';
import child_process from 'child_process';

export default class ipConfigManager {
	static getDHCPDNSservers() {
		// get interfaces
		const interfaceList = Object.keys( os.networkInterfaces() );

		// get dhcp packets
		let foundServers = [];

		interfaceList.map( ( iface ) => {
			let output = ipConfigManager.getDHCPpacket( iface );
			let parsedOutput = ipConfigManager.parseDHCPpacketOutput( output );

			if ( parsedOutput ) {
				foundServers = foundServers.concat( parsedOutput );
			}
		} );

		return foundServers;
	}

	static getDHCPpacket( iface ) {
		if ( ! /^[\w\d]+$/.test( iface ) ) {
			return '';
		}

		try {
			return child_process.execSync( 'ipconfig getpacket ' + iface + ' | grep domain_name_server', {} );
		}
		catch ( err ) {
			return '';
		}
	}

	static parseDHCPpacketOutput( output ) {

		const matchedDnsServers = output.toString().match( /\{(.*)\}/ );

		if ( ! matchedDnsServers ) {
			return [];
		}

		return matchedDnsServers[ 1 ].split( ',' ).map( ( s ) => {
			return s.trim();
		} );
	}
}
