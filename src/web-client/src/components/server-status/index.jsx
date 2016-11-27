/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import { getServerConnectionStatus } from '../../state/server/status/selectors';

require( './style.scss' );

const ServerStatus = React.createClass( {
	contextTypes: {
		store: React.PropTypes.object
	},
	render() {
		return (
			<div
				className={ cx(
					'server_status__container',
					{
						connected: this.props.serverConnected === 'CONNECTED',
						disconnected: this.props.serverConnected !== 'CONNECTED'
					}
				) }
			>
				Connected: { this.props.serverConnected }
			</div>
		);
	}
} );

export default connect(
	( state ) => {
		return {
			serverConnected: getServerConnectionStatus( state ) ? 'CONNECTED' : 'NOT CONNECTED',
		};
	},
	() => {
		return {};
	},
)( ServerStatus );
