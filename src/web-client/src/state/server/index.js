/**
 * External dependencies
 */

import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */

import status from './status';
import dnsServersList from './dns-servers-list/reducers';

export default combineReducers( {
	status,
	dnsServersList,
} );
