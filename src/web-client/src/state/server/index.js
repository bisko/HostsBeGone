/**
 * External dependencies
 */

import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */

import status from './status';
import dnsServersList from './dns-servers-list/reducers';
import staticEntriesList from './static-entries-list/reducers';
import staticEntriesStatus from './static-entries-status/reducers';

export default combineReducers( {
	status,
	dnsServersList,
	staticEntriesList,
	staticEntriesStatus,
} );
