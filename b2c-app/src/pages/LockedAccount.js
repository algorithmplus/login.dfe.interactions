import React from 'react';
import components from '../components';

export default function LockedAccount() {
    return (
        <div id="lockedAccount">
            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title='Locked account'/>
                            <p className="govuk-body">You've entered invalid details too many times and your account has been locked.</p>
                            <p className="govuk-body">You'll need to unlock your account before you can sign in.</p>
                            <p className="govuk-body">We need to send you an email with instructions on how to unlock your account.</p>
                            {/* <components.B2C /> */}
                        </div>
                    </div>
                </main>

            </div>
        </div>
    )
}
