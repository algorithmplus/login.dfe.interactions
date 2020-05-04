import React from 'react'

function Header() {
    return (
        <header class="govuk-header " role="banner" data-module="govuk-header">
            <div class="govuk-header__container govuk-width-container">
                <div class="govuk-header__content">
                <a href="#" class="govuk-header__link govuk-header__link--service-name">
                    National Careers Service
                </a>
                <button type="button" class="govuk-header__menu-button govuk-js-header-toggle" aria-controls="navigation" aria-label="Show or hide Top Level Navigation">Menu</button>
                <nav>
                    <ul id="navigation" class="govuk-header__navigation " aria-label="Top Level Navigation">
                    <li class="govuk-header__navigation-item govuk-header__navigation-item--active">
                        <a class="govuk-header__link" href="#1">
                        Job profiles
                        </a>
                    </li>
                    <li class="govuk-header__navigation-item">
                        <a class="govuk-header__link" href="#2">
                        Skills health check
                        </a>
                    </li>
                    <li class="govuk-header__navigation-item">
                        <a class="govuk-header__link" href="#3">
                        Find a course
                        </a>
                    </li>
                    <li class="govuk-header__navigation-item">
                        <a class="govuk-header__link" href="#4">
                        Contact an adviser
                        </a>
                    </li>
                    <li class="govuk-header__navigation-item">
                        <a class="govuk-header__link" href="#4">
                        About us
                        </a>
                    </li>
                    </ul>
                </nav>
                </div>
            </div>
        </header>
    )
}

export default Header;