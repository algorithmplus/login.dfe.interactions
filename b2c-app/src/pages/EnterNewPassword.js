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

                            <form id="resetPasswordFormCopy" novalidate>

                                <div class="govuk-form-group">
                                    <label class="govuk-label" for="newPasswordCopy">
                                        Create new password
                                    </label>
                                    <span id="newPasswordCopyError" class="govuk-error-message" style={{ display: 'none' }}></span>
                                    <input class="govuk-input govuk-!-width-one-half" id="newPasswordCopy" name="newPasswordCopy" type="password" />
                                </div>

                                <div class="govuk-form-group">
                                    <components.PasswordHelpContainer />
                                </div>

                                <div class="govuk-form-group">
                                    <label class="govuk-label" for="reenterPasswordCopy">
                                        Re-type password
                                    </label>
                                    <span id="reenterPasswordCopyError" class="govuk-error-message" style={{ display: 'none' }}></span>
                                    <input class="govuk-input govuk-!-width-one-half" id="reenterPasswordCopy" name="reenterPasswordCopy" type="password" />
                                </div>

                                <button class="govuk-button" id="preSubmit" type="submit">Reset password</button>

                            </form>


                            {/* add B2C component, it will be hidden but needs to be loaded */}
                            <components.B2C />
                        </div>
                    </div>
                </main>

            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/enterNewPassword.js"></script>

        </div>
    )
}
