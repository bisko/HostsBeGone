import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class EntryListEntry extends React.Component {

	constructor() {
		super();
	}

	deleteEntry = () => {
		this.props.deleteAction( this.props.entry.host, this.props.entry.type );
	};

	getDetailedInformation() {
		if ( this.props.schema && this.props.schema.properties ) {
			return (
				<div className="entry-list-entry__properties-list">
					{
						Object.keys( this.props.schema.properties ).map( ( prop ) => {
							return (
								<div
									key={ prop }
									className="entry-list-entry__properties-entry"
								>
									<span className="entry-list-entry__properties-entry-title">
										{ this.props.schema.properties[ prop ].title }
									</span>
									<span className="entry-list-entry__properties-entry-value">
										{ this.props.entry[ prop ] }
									</span>
								</div>
							);
						} )
					}
				</div>
			);
		}

		return null;
	}

	render = () => {
		return (
			<div
				className="entry-list-entry"
				key={ this.props.entry.id }
			>
				<div className="entry-list-entry__value">{ this.props.entry.label }</div>
				{ this.getDetailedInformation() }
				<div className="entry-list-entry__action-list">
					<span
						className="entry-list-entry__action-delete"
						onClick={ this.deleteEntry }
					>
						Delete
					</span>
				</div>
			</div>
		);
	}
}

EntryListEntry.propTypes = {
	entry: PropTypes.object.isRequired,
	deleteAction: PropTypes.func.isRequired,
	updateAction: PropTypes.func,
};

export default connect(
	null,
	null
)( EntryListEntry );
