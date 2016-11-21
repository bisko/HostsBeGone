import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EntryList from '../../common/entry-list/list';
import {
	getStaticEntriesList
} from '../../../state/server/static-entries-list/selectors';

class StaticEntriesList extends React.Component {
	constructor() {
		super();
	}

	componentWillMount = () => {
		this.context.socketComm.dispatch(
			'config:getStaticEntriesList',
		);
	};

	addAction = ( newValue ) => {
		this.context.socketComm.dispatch(
			'config:addStaticEntry',
			{
				entry: {
					host: newValue,
					destination: '127.0.0.1',
					type: 'A',
					ttl: 2
				}
			}
		);
	};

	deleteAction = ( id ) => {
		this.context.socketComm.dispatch(
			'config:deleteStaticEntry',
			{ entry: id }
		);
	};

	convertStaticEntriesListToEntryList( entriesList ) {
		return entriesList.map( ( entry ) => {
			return {
				id: entry.host,
				value: entry.host + ' -> ' + entry.destination
			};
		} );
	}

	render = () => {
		return (
			<div>
				Static Entries List:
				<EntryList
					items={ this.convertStaticEntriesListToEntryList( this.props.getStaticEntriesList ) }
					addAction={ this.addAction }
					deleteAction={ this.deleteAction }
					updateAction={ null }
				/>
			</div>
		);
	};
}

StaticEntriesList.contextTypes = {
	socketComm: PropTypes.object,
};

export default connect(
	( state ) => {
		return {
			getStaticEntriesList: getStaticEntriesList( state ),
		};
	}
)( StaticEntriesList );
