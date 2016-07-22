import React from 'react';
import { render } from 'react-dom';

import state from './src/state';

import SocketConnection from './src/components/socket-connection';

const App = React.createClass( {

	getInitialState() {
		window.reduxStore = state;

		console.log( state );
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
				<SocketConnection />
			</div>
		);
	}
} );

render( <App/>, document.getElementById( 'app' ) );
