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


class ServerConfiguration extends React.Component {
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
}

ServerConfiguration.propTypes = {
	serverCounter: PropTypes.number,
};

ServerConfiguration.contextTypes = {
	store: PropTypes.object,
};

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
