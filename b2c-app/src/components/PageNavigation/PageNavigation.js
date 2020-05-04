import React from 'react'

import components from '../../components';

function PageNavigation(props) {

    //build array of components with actual config
    const navItemComponents = props.navigationItems.map( navItem => <components.NavigationLink title={navItem.title} link={navItem.link}/> );
    
    return (
        <nav>
            <ul id="navigation" class="govuk-header__navigation " aria-label="Top Level Navigation">
                {navItemComponents}
            </ul>
        </nav>
    )
}

export default PageNavigation;