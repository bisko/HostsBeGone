import { get } from 'lodash';

export function getDNSServersList( state ) {
	return get( state, 'server.dnsServersList', [] );
}
