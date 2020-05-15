import React from 'react';
import components from '../components';

export default function ResetPassword() {
    return (
        <div id="resetPassword">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer"></div>

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="Access your account"/>
                            <components.B2C />
                            
                        </div>
                    </div>
                </main>

            </div>

            <script src="/__--b2cPath--__/b2c/assets/js-static/pages/resetPassword.js"></script>

        </div>
    )
}
