/**
 * External dependencies
 */
import { createStore } from 'redux'

/**
 * Internal dependencies
 */
import reducers from './reducers';

let store = createStore( reducers );

export default store;
