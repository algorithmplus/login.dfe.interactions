import React from 'react'

function HeaderTitle(props) {
    return (
        <a href="./login" className="govuk-header__link govuk-header__link--service-name">
            {props.title}
        </a>
    )
}

export default HeaderTitle;