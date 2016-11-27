import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Form from 'react-jsonschema-form';

class EntryListAddEntry extends React.Component {
	constructor() {
		super();
	}

	componentWillMount = () => {
		this.state = {
			entryValue: '',
		};
	};

	addEntry = ( form ) => {
		this.props.addAction( form.formData );
	};

	getForm = () => {
		return (
			<Form
				schema={ this.props.schema }
				onSubmit={ this.addEntry }
			/>
		);
	};

	onChange = ( event ) => {
		this.setState( { entryValue: event.target.value } );
	};

	render = () => {
		return (
			<div className="entry-list-entry-add">
				{ this.getForm() }
			</div>
		);
	}
}

EntryListAddEntry.propTypes = {
	addAction: PropTypes.func.isRequired,
	schema: PropTypes.object.isRequired,
};

export default connect(
	null,
	null
)( EntryListAddEntry );
