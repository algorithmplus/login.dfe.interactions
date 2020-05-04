import React from 'react'

function PageTitle(props) {
    return (
        <a href="./login" class="govuk-header__link govuk-header__link--service-name">
            {props.title}
        </a>
    )
}

export default PageTitle;