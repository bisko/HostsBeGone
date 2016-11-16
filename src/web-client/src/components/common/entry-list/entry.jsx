import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class EntryListEntry extends React.Component {

	constructor() {
		super();
	}

	componentWillMount = () => {
		this.state = {
			editing: false,
			entryId: this.props.entry.id,
			entryValue: this.props.entry.value,
		};
	};

	getValueField = ()=> {
		if ( this.state.editing === false ) {
			return (
				<span className="entry-list-entry__value">{ this.state.entryValue }</span>
			);
		} else {
			return (
				<div className="entry-list-entry__value">
					<input
						type="text"
						value={ this.state.entryValue }
						onChange={ this.onChange }
					/>
					<button onClick={ this.updateEntry }>Save</button>
				</div>
			);
		}
	};

	startEditing = () => {
		this.setState( { editing: true } );
	};

	onChange = ( event ) => {
		this.setState( { entryValue: event.target.value } );
	};

	updateEntry = () => {
		this.setState( { editing: false } );

		this.props.updateAction( this.state.entryValue );
	};

	deleteEntry = () => {
		this.props.deleteAction( this.state.entryId );
	};

	render = () => {
		return (
			<div
				className="=entry-list-entry"
				key={ this.props.entry.id }
			>
				{ this.getValueField() }
				<span
					className="entry-list-entry__action-edit"
					onClick={ this.startEditing }
				>
					edit
				</span>
				<span
					className="entry-list-entry__action-delete"
					onClick={ this.deleteEntry }
				>delete</span>
			</div>
		);
	}
}

EntryListEntry.propTypes = {
	entry: PropTypes.object.isRequired,
	deleteAction: PropTypes.func.isRequired,
	updateAction: PropTypes.func.isRequired,
};

export default connect(
	null,
	null
)( EntryListEntry );
