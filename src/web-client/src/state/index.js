/**
 * External dependencies
 */
import { createStore } from 'redux';

/**
 * Internal dependencies
 */
import reducers from './reducers';

const store = createStore( reducers );

export default store;
