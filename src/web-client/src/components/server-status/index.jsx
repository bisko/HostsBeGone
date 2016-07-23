import React from 'react';
import { connect } from 'react-redux';

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
			serverConnected: state.server.status.connection_status ? 'CONNECTED' : 'NOT CONNECTED',
		};
	},
	() => {
		return {};
	},
)( ServerStatus );
