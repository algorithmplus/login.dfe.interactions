import React from 'react';
import components from '../components';
import { getB2CLink } from '../helpers/urls';
import { ACTIONS } from '../constants/actions';

class AccountActivated extends React.Component {

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = `We've found your account | National Careers Service`;
    }

    render() {
        return (
            <div id="accountActivated">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <div id="pageLevelErrorContainer"></div>

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="We've activated your account" />
                                <p className="govuk-body">You can start using your account to access your information.</p>
                                <a href={getB2CLink(ACTIONS.LOGIN)} role="button" draggable="false" className="govuk-button govuk-button--start" data-module="govuk-button">
                                    Sign in to your account
                                </a>
                            </div>

                            {/* add B2C component, it will be hidden but needs to be loaded */}
                            {/* TODO move to index.html and remove from all pages */}
                            <div id="api" />
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}


export default AccountActivated;