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
                            <p className="govuk-body">You can reset your password if you've forgotten it.</p>
                            <p className="govuk-body">If you cannot remember your email address you can also retrieve it here.</p>
                            <h3 class="govuk-heading-m">Reset your password</h3>
                            <p className="govuk-body">To reset your password we need to send an email to the address registered to your account.</p>
                            <components.B2C />
                        </div>
                    </div>
                </main>

            </div>

            <script src="/__--b2cPath--__/b2c/assets/js-static/pages/resetPassword.js"></script>

        </div>
    )
}
