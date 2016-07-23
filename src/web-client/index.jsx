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
import SocketConnection from './src/components/socket-connection';
import ServerStatus from './src/components/server-status';

const App = React.createClass( {

	getInitialState() {
		/**
		 * This is for testing only
		 */
		window.reduxStore = reduxStore;

		return {
			serverCounter: 0
		};
	},

	handleData( data ) {
		console.log( 'got data' );
		console.log( data );
		// do something with the data
		this.setState( {
			serverCounter: data.counter
		} );
	},

	render() {
		return (
			<div>
				<p> Hello HostsBeGone We are now at me { this.state.serverCounter }</p>

				<Provider store={ reduxStore }>
					<ServerStatus/>
				</Provider>

				<Provider store={ reduxStore }>
					<SocketConnection />
				</Provider>
			</div>
		);
	}
} );

render( <App/>, document.getElementById( 'app' ) );
