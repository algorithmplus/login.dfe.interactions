import React from 'react';
import components from '../components';

export default function Signup() {
    return (
        <div id="signup">
            <div className="govuk-width-container">
                <components.Breadcrumbs />
                <components.PageTitle size='xl' title='Create an account'/>
                <components.B2C />
            </div>
        </div>
    )
}
