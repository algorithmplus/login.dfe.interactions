import React from 'react';
import components from '../components';

export default function EnterNewPassword() {
    return (
        <div id="enterNewPassword">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <components.PageLevelErrorContainer summaryTextContent={<components.PasswordHelp />} />

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="Reset your password" />

                            <form id="resetPasswordFormCopy" noValidate>
                                <components.ResetPasswordInput />
                                <button className="govuk-button" id="preSubmit" type="submit">Reset password</button>
                            </form>


                            {/* add B2C component, it will be hidden but needs to be loaded */}
                            <components.B2C />
                        </div>
                    </div>
                </main>

            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/enterNewPassword.js"></script>
            <script src="__--b2cPath--__/b2c/assets/js-static/validation/new-password.js"></script>

        </div>
    )
}
