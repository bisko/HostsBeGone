/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import SocketCommunication from '../../../src/lib/socket-communication';

class SocketConnection extends React.Component {
	constructor() {
		super();
		this.socketComm = null;
	}

	getChildContext = () => {
		return {
			socketComm: this.socketComm || {}
		};
	};

	initSocketCommunication = () => {
		this.socketComm = new SocketCommunication( this.context.store );
		this.socketComm.start();
	};

	stopSocketCommunication = () => {
		this.socketComm.stop();
		this.socketComm = null;
	};

	componentWillMount = () => {
		this.initSocketCommunication();
	};

	componentWillUnmount = () => {
		this.stopSocketCommunication();
	};

	render() {
		if ( this.props.children ) {
			return (
				<div>
					{ this.props.children }
				</div>
			);
		}
		else {
			return null;
		}
	}
}

SocketConnection.contextTypes = {
	store: PropTypes.object
};

SocketConnection.childContextTypes = {
	socketComm: PropTypes.object,
};

export default SocketConnection;
