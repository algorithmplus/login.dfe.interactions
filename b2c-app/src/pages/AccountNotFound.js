import React from 'react';
import components from '../components';
import { getB2CLink } from '../helpers/urls';
import { ACTIONS } from '../constants/actions';

export default function AccountNotFound() {
    return (
        <div id="accountNotFound">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer"></div>

                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.PageTitle size='xl' title='We have not been able to find your account'/>
                            <p className="govuk-body">
                                <a href={getB2CLink(ACTIONS.RESET_PASSWORD)} className="govuk-link">Try again</a>
                                &nbsp;with other details you may have used when you created your account.
                            </p>
                            <p className="govuk-body">If you think you could have more than one account, call 0800 100 900. We'll confirm your details and delete any accounts you do not need.</p>
                            <p className="govuk-body">If you're unable to recover your registered email address, you'll have to&nbsp;
                                <a href={getB2CLink(ACTIONS.SIGNUP)} className="govuk-link">create a new account</a>
                                .
                            </p>
                            <components.B2C />
                        </div>
                    </div>
                </main>

            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/accountNotFound.js"></script>

        </div>
    )
}
