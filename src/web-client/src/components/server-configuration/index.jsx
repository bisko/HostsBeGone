/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import SocketConnection from '../../components/socket-connection';
import ServerStatus from '../../components/server-status';
import DnsServerList from '../../components/server-configuration/dns-server-list';

import { getServerCounter } from '../../state/server/counter/selectors';

const ServerConfiguration = React.createClass( {
	propTypes: {
		serverCounter: React.PropTypes.number,
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
			serverCounter: getServerCounter( state )
		};
	},
	() => {
		return {};
	}
)( ServerConfiguration );
