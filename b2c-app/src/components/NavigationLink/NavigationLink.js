import React from 'react'

function NavigationLink(props) {    
    return (
        <li class="govuk-header__navigation-item">
            <a class="govuk-header__link" href={props.link}>
            {props.title}
            </a>
        </li>
    )
}

export default NavigationLink;