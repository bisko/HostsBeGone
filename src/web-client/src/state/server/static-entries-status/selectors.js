import { get } from 'lodash';

export function getStaticEntriesStatus( state ) {
	return get( state, 'server.staticEntriesStatus', false );
}
