import React from 'react';
import components from '../components';

export default function AccountActivated() {
    return (
        <div id="login">
            <components.Header />
            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="We've activated your account"/>
                            <components.B2C />
                            <p className="govuk-body">You can start using your account to access your information.</p>
                            <a href="./login" role="button" draggable="false" class="govuk-button govuk-button--start" data-module="govuk-button">
                                Sign in to your account
                            </a>
                        </div>
                    </div>
                </main>

            </div>
            <components.Footer />
        </div>
    )
}
