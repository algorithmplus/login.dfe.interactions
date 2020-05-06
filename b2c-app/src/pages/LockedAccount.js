import React from 'react';
import components from '../components';

export default function LockedAccount() {
    return (
        <div id="login">
            <components.Header />
            <div class="govuk-width-container">
                <components.Breadcrumbs />

                <main class="govuk-main-wrapper">
                    <div class="govuk-grid-row">
                        <div class="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title='Locked account'/>
                            <p class="govuk-body">You've entered invalid details too many times and your account has been locked.</p>
                            <p class="govuk-body">You'll need to unlock your account before you can sign in.</p>
                            <p class="govuk-body">We need to send you an email with instructions on how to unlock your account.</p>
                            {/* <components.B2C /> */}
                        </div>
                    </div>
                </main>

            </div>
            <components.Footer />
        </div>
    )
}
