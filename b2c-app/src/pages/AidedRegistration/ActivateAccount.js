import React from 'react';
import components from '../../components';

export default function ActivateAccount() {
    return (
        <div id="activateAccount">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <components.PageLevelErrorContainer summaryTextContent={<components.PasswordHelp />} />

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="Activate your account" />

                            <form id="activateAccountFormCopy" novalidate>
                                <components.ResetPasswordInput />
                                <p className="govuk-body">As an extra security check, enter your date of birth.</p>
                                <components.DateOfBirthInput />
                                <components.TermsAndConditions />
                                <button className="govuk-button" id="preSubmit" type="submit">Activate account</button>
                            </form>

                            {/* add B2C component, it will be hidden but needs to be loaded */}
                            <components.B2C />
                        </div>
                    </div>
                </main>

            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/aidedRegistration/activateAccount.js"></script>
            <script src="__--b2cPath--__/b2c/assets/js-static/validation/new-password.js"></script>
            <script src="__--b2cPath--__/b2c/assets/js-static/validation/date-of-birth.js"></script>
            <script src="__--b2cPath--__/b2c/assets/js-static/validation/terms-and-conditions.js"></script>

        </div>
    )
}
