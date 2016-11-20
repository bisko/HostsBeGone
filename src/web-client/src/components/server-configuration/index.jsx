/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import SocketConnection from '../../components/socket-connection';
import ServerStatus from '../../components/server-status';
import DnsServerList from '../../components/server-configuration/dns-server-list';


const ServerConfiguration = React.createClass( {
	propTypes: {
		serverCounter: PropTypes.number,
	},
	contextTypes: {
		store: PropTypes.object,
	},
	render() {
		return (
			<div>
				<p> Hello HostsBeGone We are now at me { this.props.serverCounter }</p>
				<ServerStatus/>
				<SocketConnection>
					<DnsServerList/>
				</SocketConnection>
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			serverCounter: Math.random()
		};
	},
	() => {
		return {};
	}
)( ServerConfiguration );
