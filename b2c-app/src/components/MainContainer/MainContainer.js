import React from 'react'

import components from '../../components'

function MainContainer () {
    return (
        <div class="govuk-width-container">
            <components.Breadcrumbs />
            <components.PageTitle />
            <components.B2C />
        </div>
    );
}

export default MainContainer;