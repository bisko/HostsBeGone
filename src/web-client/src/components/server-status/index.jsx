/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getServerConnectionStatus } from '../../state/reducers/server/status/selectors';

const ServerStatus = React.createClass( {
	contextTypes: {
		store: React.PropTypes.object
	},
	render() {
		return (
			<div className="server_status__container">
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
