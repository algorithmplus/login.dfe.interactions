import React from 'react'

import './Header.scss'

import components from '../../components';

function Header() {
    return (
        <header class="govuk-header " role="banner" data-module="govuk-header">
            <div class="govuk-header__container govuk-width-container">
                <div class="govuk-header__content">
                    <components.PageTitle />
                    <components.PageNavigation />
                </div>
            </div>
        </header>
    )
}

export default Header;