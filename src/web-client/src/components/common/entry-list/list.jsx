import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import EntryListEntry from './entry';
import EntryListAddEntry from './entry-add';

class EntryList extends React.Component {
	constructor() {
		super();
	}

	sort( items ) {
		const updatedItems = [ ...items ];

		if ( this.props.sortBy ) {
			updatedItems.sort( ( a, b ) => {
				for ( let i = 0; i < this.props.sortBy.length; i ++ ) {
					const key = this.props.sortBy[ i ];
					if ( a[ key ] < b[ key ] ) {
						return - 1;
					} else if ( a[ key ] > b[ key ] ) {
						return 1;
					}
				}

				return 0;
			} );
		}

		return updatedItems;
	}

	group( items ) {
		const result = [];

		items.map( ( item ) => {
			if ( ! result[ item[ this.props.groupBy ] ] ) {
				result[ item[ this.props.groupBy ] ] = [];
			}

			result[ item[ this.props.groupBy ] ].push( item );
		} );

		return result;
	}

	getEntryItem( entry ) {
		return (
			<EntryListEntry
				key={ entry.id }
				entry={ entry }
				deleteAction={ this.props.deleteAction }
				updateAction={ this.props.updateAction }
				schema={ this.props.detailedInformation ? this.props.schema : null }
			/>
		);
	}

	getGroupedItems( itemsList ) {
		const groupedItems = this.group( itemsList );

		return Object.keys( groupedItems ).map( ( itemGroup ) => {
			return (
				<div
					key={ itemGroup }
					className="entry-list__group"
				>
					<div className="entry-list__group-title">{ itemGroup }</div>
					{
						groupedItems[ itemGroup ].map( ( groupItem ) => {
							return this.getEntryItem( groupItem );
						} )
					}
				</div>
			);
		} );
	}

	render = () => {
		const itemsList = this.sort( this.props.items );

		return (
			<div>
				{
					this.props.groupBy
						? this.getGroupedItems( itemsList )
						: itemsList.map( ( entry ) => {
							return this.getEntryItem( entry );
						} )
				}
				<EntryListAddEntry
					addAction={ this.props.addAction }
					schema={ this.props.schema }
				/>
			</div>
		);
	}
}

EntryList.propTypes = {
	items: PropTypes.array.isRequired,
	deleteAction: PropTypes.func.isRequired,
	updateAction: PropTypes.func,
	addAction: PropTypes.func.isRequired,
	detailedInformation: PropTypes.bool,
	schema: PropTypes.object.isRequired,
	sortBy: PropTypes.array,
	groupBy: PropTypes.string
};

export default connect(
	null,
	null
)( EntryList );
