import React from 'react';
import components from '../components';

export default function EmailSent() {
    return (
        <div id="login">
            <components.Header />
            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="We've sent you an email"/>
                            <components.B2C />
                            <p className="govuk-body">Check your spam folder if you can't see it in a few minutes.</p>
                            {/* <p className="govuk-body">If you don't receive an email after this time you can resend the activation email.</p> */}
                            <p className="govuk-body">This link expires in 24 hours.</p>
                        </div>
                    </div>
                </main>

            </div>
            <components.Footer />
        </div>
    )
}
