import React from 'react';
import { connect } from 'react-redux';
import EntryList from '../../common/entry-list/list';

class DnsServerlist extends React.Component {
	constructor() {
		super();
		this.state = {
			itemsList: [
				{
					id: 1,
					address: '8.8.8.8',
					options: {}
				},
				{
					id: 2,
					address: '8.8.4.4',
					options: {}
				},
				{
					id: 3,
					address: '4.2.2.1',
					options: {}
				},
			]
		};
	}

	convertServerListToEntryList( serverList ) {
		return serverList.map( ( entry ) => {
			return {
				id: entry.id,
				value: entry.address
			};
		} );
	}

	updateAction = ( id, newValue ) => {
		return this.state.itemsList.map( ( entry )=> {
			if ( entry.id === id ) {
				return {
					...entry,
					address: newValue
				};
			}

			return entry;
		} );
	};

	deleteAction = ( id ) => {

		this.setState( {
			itemsList: this.state.itemsList.filter( ( entry ) => {
				return entry.id !== id;
			} )
		} );
	};

	render = () => {
		return (
			<div>
				Dns server list:
				<EntryList
					items={ this.convertServerListToEntryList( this.state.itemsList ) }
					updateAction={ this.updateAction }
					deleteAction={ this.deleteAction }
				/>
			</div>
		);
	};
}

export default connect( null, null )( DnsServerlist );
