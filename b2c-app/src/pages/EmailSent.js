import React from 'react';
import components from '../components';
import { getB2CLink } from '../helpers/urls';
import { ACTIONS } from '../constants/actions';

export default function EmailSent() {
    return (
        <div id="emailSent">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer"></div>

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title="We've sent you an email"/>
                            <components.B2C />
                            <p className="govuk-body">Check your spam folder if you can't see it in a few minutes.</p>
                            {/* <p className="govuk-body">If you don't receive an email after this time you can resend the activation email.</p> */}
                            <p className="govuk-body">This link expires in 24 hours.</p>
                            <p className="govuk-body">
                                <a href={getB2CLink(ACTIONS.SIGNUP)} className="govuk-link">I entered the wrong email address</a>
                            </p>
                        </div>
                    </div>
                </main>

            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/emailSent.js"></script>

        </div>
    )
}
