import { get } from 'lodash';
export function getDNSServerByID( id, state ) {

}

export function getDNSServersList( state ) {
	return get( state, 'server.dnsServersList', [] );
}
