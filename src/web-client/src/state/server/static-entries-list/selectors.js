import { get } from 'lodash';

export function getStaticEntriesList( state ) {
	return get( state, 'server.staticEntriesList', [] );
}

export function getStaticEntryByHostAndType( state, host, type ) {
	const entries = getStaticEntriesList( state );

	return entries.find( ( entry ) => {
		return entry.host === host && entry.type === type;
	} );
}
