import React from 'react'

function HeaderTitle(props) {
    return (
        <a href="https://nationalcareers.service.gov.uk/" className="govuk-header__link govuk-header__link--service-name">
            {props.title}
        </a>
    )
}

export default HeaderTitle;