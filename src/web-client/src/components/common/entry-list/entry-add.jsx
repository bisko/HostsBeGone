import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class EntryListAddEntry extends React.Component {
	constructor() {
		super();
	}

	componentWillMount = () => {
		this.state = {
			entryValue: '',
		};
	};

	addEntry = () => {
		if ( this.props.addAction( this.state.entryValue ) ) {
			this.setState( { entryValue: '' } );
		}
	};

	getValueField = ()=> {
		return (
			<div className="entry-list-entry__value">
				<input
					type="text"
					value={ this.state.entryValue }
					onChange={ this.onChange }
				/>
				<button onClick={ this.addEntry }>Save</button>
			</div>
		);
	};

	onChange = ( event ) => {
		this.setState( { entryValue: event.target.value } );
	};

	render = () => {
		return (
			<div className="entry-list-entry-add">
				{ this.getValueField() }
			</div>
		);
	}
}

EntryListAddEntry.propTypes = {
	addAction: PropTypes.func.isRequired,
};

export default connect(
	null,
	null
)( EntryListAddEntry );
