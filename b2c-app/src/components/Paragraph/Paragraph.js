import React from 'react';

class Paragraph extends React.Component {

    render() {

        return (

            <p className="govuk-body">{this.props.text}</p>

        )
    }
}

export default Paragraph;