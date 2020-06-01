import React from 'react';
import components from '../../components';

class ActivateAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: null,
            dobDay: null,
            dobMonth: null,
            dobYear: null,
            termsAndConditionsAccepted: false
        };
    }

    onPasswordChange = (value) => {
        this.setState({ password: value }, () => {
            console.log('password in page set to ' + this.state.password);
        });
    }

    render() {

        return (
            <div id="activateAccount">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <components.PageLevelErrorContainer summaryTextContent={<components.PasswordHelp />} />

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="Activate your account" />

                                <form id="activateAccountForm" noValidate>
                                    <components.CreateNewPassword onChange={this.onPasswordChange} />
                                    <p className="govuk-body">As an extra security check, enter your date of birth.</p>
                                    <components.DateOfBirthInput />
                                    <components.TermsAndConditions />
                                    <button className="govuk-button" id="preSubmit" type="submit">Activate account</button>
                                </form>

                                {/* add B2C component, it will be hidden but needs to be loaded */}
                                {/* TODO move to index.html and remove from all pages */}
                                <div id="api" />
                            </div>
                        </div>
                    </main>

                </div>

                <script src="__--b2cPath--__/b2c/assets/js-static/pages/aidedRegistration/activateAccount.js"></script>
                <script src="__--b2cPath--__/b2c/assets/js-static/validation/new-password.js"></script>
                <script src="__--b2cPath--__/b2c/assets/js-static/validation/date-of-birth.js"></script>
                <script src="__--b2cPath--__/b2c/assets/js-static/validation/terms-and-conditions.js"></script>

            </div>
        )
    }
}

export default ActivateAccount;