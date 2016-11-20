export function addDNSServer( server ) {
	return {
		type: 'DNS_SERVER_LIST_ADD',
		server,
	};
}

export function updateDNSServer( server_id, server ) {
	return {
		type: 'DNS_SERVER_LIST_UPDATE',
		server_id,
		server,
	};
}

export function removeDNSServer( server_id ) {
	return {
		type: 'DNS_SERVER_LIST_REMOVE',
		server_id,
	};
}
