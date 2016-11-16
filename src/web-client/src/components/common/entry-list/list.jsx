import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import EntryListEntry from './entry';

class EntryList extends React.Component {
	constructor() {
		super();
	}

	render = () => {
		return (
			<div>
				{
					this.props.items.map( ( entry )=> {
						return (
							<EntryListEntry
								key={ entry.id }
								entry={ entry }
								deleteAction={ this.props.deleteAction }
								updateAction={ this.props.updateAction }
							/>
						);
					} )
				}
			</div>
		);
	}
}

EntryList.propTypes = {
	items: PropTypes.array.isRequired,
	deleteAction: PropTypes.func.isRequired,
	updateAction: PropTypes.func.isRequired,
};

export default connect(
	null,
	null
)( EntryList );
