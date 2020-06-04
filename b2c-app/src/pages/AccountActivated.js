import React from 'react';
import components from '../components';
import { ACTIONS } from '../constants/actions';

class AccountActivated extends React.Component {

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
        document.title = `We've activated your account | National Careers Service`;
    }

    render() {
        return (
            <div id="accountActivated">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="We've activated your account" />
                                <components.Paragraph text='You can start using your account to access your information.' />
                                <components.ButtonLink action={ACTIONS.LOGIN} text='Sign in to your account'/>
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }

}

export default AccountActivated;