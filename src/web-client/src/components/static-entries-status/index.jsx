/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';

/**
 * Internal dependencies
 */
import { getStaticEntriesStatus } from '../../state/server/static-entries-status/selectors';

require( './style.scss' );

class StaticEntriesStatus extends React.Component {

	componentWillMount = () => {
		this.context.socketComm.dispatch(
			'config:getStaticEntriesStatus',
		);
	};

	toggleStaticEntriesStatus = () => {
		if ( this.props.entriesEnabled ) {
			this.context.socketComm.dispatch(
				'config:disableStaticEntries',
			);
		} else {
			this.context.socketComm.dispatch(
				'config:enableStaticEntries',
			);
		}
	};

	render = () => {
		return (
			<div
				className={ cx(
					'static-entries-status__container',
					{
						enabled: this.props.entriesEnabled === true,
						disabled: this.props.entriesEnabled === false
					}
				) }
				onClick={ this.toggleStaticEntriesStatus }
			>
				Static entries: { this.props.entriesEnabled ? 'ENABLED' : 'DISABLED' }
			</div>
		);
	};
}

StaticEntriesStatus.contextTypes = {
	socketComm: PropTypes.object,
};

export default connect(
	( state ) => {
		return {
			entriesEnabled: getStaticEntriesStatus( state ),
		};
	},
	() => {
		return {};
	},
)( StaticEntriesStatus );
