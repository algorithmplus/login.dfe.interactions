import React from 'react';
import components from '../components';
import { getB2CLink } from '../helpers/urls';
import { ACTIONS } from '../constants/actions';

export default function Login() {

    return (
        
        <div id="login">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer" style={{ display: 'none' }}>
                    <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
                            <h2 class="govuk-error-summary__title" id="error-summary-title">
                                There is a problem
                            </h2>
                            <div class="govuk-error-summary__body">
                                {/* TODO deal with different headers depending on the actual error
                                TODO style header and links differently */}
                                {/* <p> Your sign in details are incorrect. Try again.</p>
                                <p>
                                    <a href={getB2CLink(ACTIONS.RESET_PASSWORD)} id="resetPasswordCopy" class="govuk-link">
                                        I cannot access my account
                                    </a>
                                </p> */}
                                <ul id="errorSummaryItems" class="govuk-list govuk-error-summary__list">
                                    {/* we will add children here */}
                                </ul>
                            </div>
                    </div>
                </div>

                <div className="govuk-width-container ">
                    <main className="govuk-main-wrapper " id="main-content" role="main">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-one-half">
                                <components.PageTitle size='l' title='Sign in'/>
                                <components.B2C />

                                <form id="loginFormCopy" novalidate>
                                    <div class="govuk-form-group">
                                        <label class="govuk-label" for="emailCopy">
                                            Copy Email address
                                        </label>
                                        <span id="emailCopyError" class="govuk-error-message" style={{ display: 'none' }}></span>
                                        <input class="govuk-input govuk-!-width-one-half" id="emailCopy" name="emailCopy" type="text"/>
                                    </div>
                                    <div class="govuk-form-group">
                                        <label class="govuk-label" for="passwordCopy">
                                            Copy Password
                                        </label>
                                        <span id="passwordCopyError" class="govuk-error-message" style={{ display: 'none' }}></span>
                                        <input class="govuk-input govuk-!-width-one-half" id="passwordCopy" name="passwordCopy" type="password"/>
                                    </div>
                                    <button class="govuk-button" id="preSubmit" type="submit">Sign in</button>
                                </form>
                                <p class="govuk-body">
                                    <a href={getB2CLink(ACTIONS.RESET_PASSWORD)} id="resetPasswordCopy" class="govuk-link">
                                        I cannot access my account
                                    </a>
                                </p>

                            </div>
                            <div className="govuk-grid-column-one-half">
                                <components.PageTitle size='l' title='Create an account'/>
                                <p className="govuk-body">
                                    <a href={getB2CLink(ACTIONS.SIGNUP)} className="govuk-link">Creating an account</a>
                                    &nbsp;allows you to access and save your skills health check reports.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
                
            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/loginCopy.js"></script>

        </div>
    )
}
