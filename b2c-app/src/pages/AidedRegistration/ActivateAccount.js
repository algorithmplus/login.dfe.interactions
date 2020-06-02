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
        this.hasErrorItems = this.hasErrorItems.bind(this);
    }

    componentDidMount() {
        document.title = 'Activate your account | National Careers Service';
    }

    onPasswordChange(value) {
        this.setState({ password: value });
    }

    onPasswordError(errors) {
        this.setState({ errors: [errors.newPassword, errors.reenteredPassword] });
    }

    handleSubmit(e) {
        e.preventDefault();
        //do something to validate and decide if we submit or show errors
        if (this.state.password &&
            this.state.dobDay &&
            this.state.dobMonth &&
            this.state.dobYear &&
            this.state.termsAndConditionsAccepted) {
            this.setState({ showErrors: false });
            //everything is valid, set data and submit B2C form
            this.setDataAndSubmit();
        }
        else {
            //show errors in each component
            this.state.errors.forEach( (error) => {
                error.visibleMessage = error.currentMessage;
            });
            this.setState({ showErrors: true });
        }
    }

    hasErrorItems() {
        const hasErrors = this.state.errors.some(errorItem => {
            return !!errorItem.visibleMessage;
        });
        return hasErrors;
    }

    setDataAndSubmit() {
        //retrieve all elements we will need and set their values
        document.getElementById('newPassword').value = this.state.password;
        document.getElementById('reenteredPassword').value = this.state.password;
        //submit B2C form
        document.getElementById('continue').click();
    }

    render() {

        const errorSummary = this.state.showErrors &&  this.hasErrorItems() ?
            (
                <components.PageLevelErrorContainer errorItems={this.state.errors} summaryTextContent={<components.PasswordHelp />} />
            ) :
            null;

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