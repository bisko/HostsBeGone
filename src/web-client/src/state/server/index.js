/**
 * External dependencies
 */

import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */

import status from './status';
import counter from './counter';

export default combineReducers( {
	status,
	counter
} );
