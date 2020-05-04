import React from 'react'

import components from '../../components';

function PageNavigation() {
    return (
        <nav>
            <ul id="navigation" class="govuk-header__navigation " aria-label="Top Level Navigation">
                <components.NavigationLink />
                <components.NavigationLink />
                <components.NavigationLink />
                <components.NavigationLink />
                <components.NavigationLink />
            </ul>
        </nav>
    )
}

export default PageNavigation;