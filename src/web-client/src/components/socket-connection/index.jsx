import React from 'react';

import SocketCommunication from '../../../src/lib/socket-communication';

const SocketConnection = React.createClass( {
	socketComm: null,

	componentWillMount() {
		const socketComm = new SocketCommunication();
		socketComm.start();

		this.socketComm = socketComm;
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
