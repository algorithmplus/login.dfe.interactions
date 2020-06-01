import React from 'react';
import components from '../components';
import { getB2CLink } from '../helpers/urls';
import { ACTIONS } from '../constants/actions';

export default function PasswordChanged() {
    return (
        <div id="passwordChanged">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer"></div>

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="We've changed your password"/>
                            <p className="govuk-body">Use your new details to sign in and access your information.</p>
                            <a href={getB2CLink(ACTIONS.LOGIN)} role="button" draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
                                Sign in to your account
                            </a>

                            {/* B2C component will be ignored as we don't need anything from it (it has to be loaded though) */}
                            <components.B2C />
                        </div>
                    </div>
                </main>

            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/passwordChanged.js"></script>

        </div>
    )
}
