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
            termsAndConditionsAccepted: false,
            showErrors: false,
            errors: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onPasswordError = this.onPasswordError.bind(this);
    }

    onPasswordChange(value) {
        this.setState({ password: value });
        this.setState({ showErrors: false });
    }

    onPasswordError(errors) {
        this.setState({ errors: [errors.newPassword, errors.reenteredPassword] });
    }

    handleSubmit(e) {
        e.preventDefault();
        //do something to validate and decide if we submit or show errors
        if (this.password &&
            this.dobDay &&
            this.dobMonth &&
            this.dobYear &&
            this.termsAndConditionsAccepted) {
                this.setState({ showErrors: false });
                console.log('everything is valid, submit');
        }
        else {
            //show errors in each component
            this.setState({ showErrors: true });
        }
    }

    render() {

        const errorSummary = this.state.showErrors ?
            (
                <components.PageLevelErrorContainer errorItems={this.state.errors} summaryTextContent={<components.PasswordHelp />} />
            ) :
            '';

        return (
            <div id="activateAccount">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    {errorSummary}

                    <main className="govuk-main-wrapper">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-two-thirds">
                                <components.PageTitle size='xl' title="Activate your account" />

                                <form id="activateAccountForm" onSubmit={this.handleSubmit} noValidate>
                                    <components.CreateNewPassword onChange={this.onPasswordChange} onError={this.onPasswordError} showErrors={this.state.showErrors} />
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

                {/* <script src="__--b2cPath--__/b2c/assets/js-static/pages/aidedRegistration/activateAccount.js"></script>
                <script src="__--b2cPath--__/b2c/assets/js-static/validation/new-password.js"></script>
                <script src="__--b2cPath--__/b2c/assets/js-static/validation/date-of-birth.js"></script>
                <script src="__--b2cPath--__/b2c/assets/js-static/validation/terms-and-conditions.js"></script> */}

            </div>
        )
    }
}

export default ActivateAccount;