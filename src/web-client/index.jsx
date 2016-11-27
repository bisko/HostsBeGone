/**
 * External dependencies
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

/**
 * Internal dependencies
 */
import reduxStore from './src/state';
import ServerConfiguration from './src/components/server-configuration';

require( './style.scss' );

const App = React.createClass( {
	componentWillMount() {
		/**
		 * This is for testing only
		 */
		window.reduxStore = reduxStore;
	},
	render() {
		return (
			<div>
				<Provider store={ reduxStore }>
					<ServerConfiguration/>
				</Provider>
			</div>
		);
	}
} );

render( <App/>, document.getElementById( 'app' ) );
