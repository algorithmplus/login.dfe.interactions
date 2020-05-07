import React from 'react'

import './Header.scss'

import components from '../../components';

import headerData from '../../data/headerData.json';

function Header() {
    return (
        <header className="govuk-header " role="banner" data-module="govuk-header">
            <div className="govuk-header__container govuk-width-container ncs-custom">
                <div className="govuk-header__content">
                    <components.HeaderTitle title={headerData.title} />
                    <components.PageNavigation navigationItems={headerData.navigationItems} />
                </div>
            </div>
        </header>
    )
}

export default Header;