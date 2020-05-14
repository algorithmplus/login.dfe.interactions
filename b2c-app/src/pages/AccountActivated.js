import React from 'react';
import components from '../components';
import { getB2CLink } from '../helpers/urls';

export default function AccountActivated() {
    return (
        <div id="accountActivated">
            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer"></div>

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="We've activated your account"/>
                            <p className="govuk-body">You can start using your account to access your information.</p>
                            <a href={getB2CLink('login')} role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button">
                                Sign in to your account
                            </a>
                        </div>
                    </div>
                </main>

            </div>
        </div>
    )
}
