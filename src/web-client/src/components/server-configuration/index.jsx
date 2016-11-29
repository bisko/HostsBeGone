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

	render = () => {
		return (
			<div>
				<p> Welcome to HostsBeGone configuration! </p>
				<SocketConnection>
					<div className="statusComponents">
						<ServerStatus/>
						<DnsServerRestartButton/>
						<StaticEntriesStatus/>
					</div>
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
				</SocketConnection>
			</div>
		);
	};
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
