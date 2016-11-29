/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import SocketConnection from '../../components/socket-connection';
import ServerStatus from '../../components/server-status';
import DnsServerList from '../../components/server-configuration/dns-server-list';
import StaticEntriesList from '../../components/server-configuration/static-entries-list';
import StaticEntriesStatus from '../../components/static-entries-status';
import DnsServerRestartButton from '../../components/server-configuration/dns-server-restart-button';

import { getServerConnectionStatus } from '../../state/server/status/selectors';

import './style.scss';

class ServerConfiguration extends React.Component {
	constructor() {
		super();

		this.state = {
			activeComponent: 'serverList'
		};
	}

	getActiveComponent = () => {
		if ( this.state.activeComponent === 'serverList' ) {
			return (
				<DnsServerList/>
			);
		}

		return (
			<StaticEntriesList/>
		);
	};

	setActiveComponent( component ) {
		this.setState( {
			activeComponent: component
		} );
	}

	getStaticEntriesButton = () => {
		if ( ! this.props.serverRunning ) {
			return null;
		}

		return (
			<StaticEntriesStatus/>
		);
	};

	getServerConfigurationManager = () => {
		if ( ! this.props.serverRunning ) {
			return null;
		}

		return (
			<div>
				<div className="server-configuration__chooser">
					<button
						className={ cx(
							'server-configuration-chooser__button',
							{ active: this.state.activeComponent === 'serverList' }
						) }
						onClick={ () => {
							this.setActiveComponent( 'serverList' );
						} }
					>
						Servers list
					</button>
					<button
						className={ cx(
							'server-configuration-chooser__button',
							{ active: this.state.activeComponent === 'staticEntries' }
						) }
						onClick={ () => {
							this.setActiveComponent( 'staticEntries' );
						} }
					>
						Static entries list
					</button>
				</div>
				{ this.getActiveComponent() }
			</div>
		);
	};

	render = () => {
		return (
			<div>
				<p> Welcome to HostsBeGone configuration! </p>
				<SocketConnection>
					<div className="statusComponents">
						<ServerStatus/>
						<DnsServerRestartButton
							serverRunning={ this.props.serverRunning }
						/>
						{ this.getStaticEntriesButton() }
					</div>
					{ this.getServerConfigurationManager() }
				</SocketConnection>
			</div>
		);
	};
}

ServerConfiguration.propTypes = {
	serverRunning: PropTypes.bool,
};

ServerConfiguration.contextTypes = {
	store: PropTypes.object,
};

export default connect(
	( state ) => {
		return {
			serverRunning: getServerConnectionStatus( state ),
		};
	}, null
)( ServerConfiguration );
