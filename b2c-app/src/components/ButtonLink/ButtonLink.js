import React from 'react';
import { getB2CLink } from '../../helpers/urls';

class ButtonLink extends React.Component {

    render() {

        return (

            <a href={getB2CLink(this.props.action)} role="button" draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
                {this.props.text}
            </a>
        )
    }
}

export default ButtonLink;