import React from 'react'

function HeaderTitle(props) {
    return (
        <a href="./signup" className="govuk-header__link govuk-header__link--service-name">
            {props.title}
        </a>
    )
}

export default HeaderTitle;