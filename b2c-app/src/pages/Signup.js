import React from 'react';
import components from '../components';

export default function Signup() {
    return (
        <div id="signup">

            <div className="govuk-width-container">
                <components.Breadcrumbs />
                <div id="pageLevelErrorContainer"></div>
                <components.PageTitle size='xl' title='Create an account'/>
                <components.B2C />
            </div>

            <script src="/__b2cPath__/b2c/assets/js-static/pages/signup.js"></script>

        </div>
    )
}
