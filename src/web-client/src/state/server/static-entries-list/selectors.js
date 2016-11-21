import { get } from 'lodash';

export function getStaticEntriesList( state ) {
	return get( state, 'server.staticEntriesList', [] );
}
