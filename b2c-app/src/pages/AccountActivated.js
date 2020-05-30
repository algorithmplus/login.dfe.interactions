import React from 'react';
import components from '../components';
import { getB2CLink } from '../helpers/urls';
import { ACTIONS } from '../constants/actions';

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
                            <components.B2C />
                            <a href={getB2CLink(ACTIONS.LOGIN)} role="button" draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
                                Sign in to your account
                            </a>
                        </div>
                    </div>
                </main>

            </div>

            <script src="__--b2cPath--__/b2c/assets/js-static/pages/accountActivated.js"></script>

        </div>
    )
}
