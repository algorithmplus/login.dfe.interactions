import React from 'react';
import { getB2CLink } from '../../helpers/urls';

class Link extends React.Component {

    render() {

        return (

            <a href={getB2CLink(this.props.action)} className="govuk-link">
                {this.props.text}
            </a>

        )
    }
}

export default Link;