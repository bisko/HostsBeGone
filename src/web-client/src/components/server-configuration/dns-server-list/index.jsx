import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EntryList from '../../common/entry-list/list';
import {
	getDNSServersList,
} from '../../../state/server/dns-servers-list/selectors';
import {
	addDNSServer,
	updateDNSServer,
	removeDNSServer,
} from '../../../state/server/dns-servers-list/actions';

class DnsServerList extends React.Component {
	constructor() {
		super();
	}

	componentWillMount = () => {
		this.context.socketComm.dispatch(
			'config:getDNSServersList',
		);
	};

	convertServerListToEntryList( serverList ) {
		return serverList.map( ( entry ) => {
			return {
				id: entry.id,
				value: entry.address
			};
		} );
	}

	addAction = ( newValue ) => {
		this.context.socketComm.dispatch(
			'config:addDNSServer',
			{
				server: {
					address: newValue,
					options: {}
				}
			}
		);

		return true;
	};

	deleteAction = ( id ) => {
		this.context.socketComm.dispatch(
			'config:deleteDNSServer',
			{ serverId: id }
		);
	};

	render = () => {
		return (
			<div>
				Dns server list:
				<EntryList
					items={ this.convertServerListToEntryList( this.props.getDNSServersList ) }
					addAction={ this.addAction }
					deleteAction={ this.deleteAction }
					updateAction={ null }
				/>
			</div>
		);
	};
}

DnsServerList.contextTypes = {
	socketComm: PropTypes.object,
};

export default connect(
	( state ) => {
		return {
			getDNSServersList: getDNSServersList( state ),
		};
	},
	( dispatch ) => {
		return bindActionCreators( {
			addDNSServer,
			removeDNSServer,
			updateDNSServer,
		}, dispatch );
	}
)( DnsServerList );
