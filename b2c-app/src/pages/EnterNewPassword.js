import React from 'react';
import components from '../components';

export default function EnterNewPassword() {
    return (
        <div id="enterNewPassword">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer" style={{ display: 'none' }}>
                    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
                            <h2 class="govuk-error-summary__title" id="error-summary-title">
                                There is a problem
                            </h2>
                            <div id="errorSummaryText" style={{ display: 'none' }}>
                                <p class="govuk-body">Your password must:</p>
                                <ul class="govuk-list govuk-list--bullet">
                                    <li>be between 8 and 16 characters</li>
                                    <li>include at least one uppercase letter and one lowercase letter</li>
                                    <li>include at least one number or one symbol</li>
                                </ul>
                            </div>
                            <div class="govuk-error-summary__body">
                                <ul id="errorSummaryItems" class="govuk-list govuk-error-summary__list">
                                    {/* we will add children here when errors occur */}
                                </ul>
                            </div>
                    </div>
                </div>

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="Reset your password"/>

                            <form id="resetPasswordFormCopy" novalidate>

                                <div class="govuk-form-group">
                                    <label class="govuk-label" for="newPasswordCopy">
                                        Create new password
                                    </label>
                                    <span id="newPasswordCopyError" class="govuk-error-message" style={{ display: 'none' }}></span>
                                    <input class="govuk-input govuk-!-width-one-half" id="newPasswordCopy" name="newPasswordCopy" type="password" />
                                </div>

                                <div class="govuk-form-group">
                                    <details class="govuk-details">
                                        <summary class="govuk-details__summary">
                                            <span class="govuk-details__summary-text">
                                                Help choosing a valid password
                                            </span>
                                        </summary>
                                        <div class="govuk-details__text">
                                            <p class="govuk-body">Your password must:</p>
                                            <ul class="govuk-list govuk-list--bullet">
                                                <li>be between 8 and 16 characters</li>
                                                <li>include at least one uppercase letter and one lowercase letter</li>
                                                <li>include at least one number or one symbol</li>
                                            </ul>
                                        </div>
                                    </details>
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
