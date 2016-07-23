/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import SocketCommunication from '../../../src/lib/socket-communication';

const SocketConnection = React.createClass( {
	socketComm: null,

	contextTypes: {
		store: React.PropTypes.object
	},

	componentWillMount() {
		this.socketComm = new SocketCommunication( this.context.store );
		this.socketComm.start();
	},
	componentWillUnmount() {
		this.socketComm.stop();
		this.socketComm = null;
	},

	render() {
		return (
			<div></div>
		);
	}
} );

export default SocketConnection;
