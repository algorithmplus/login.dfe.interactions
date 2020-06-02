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
            tsAndCsAccepted: false,
            showErrors: false,
            errors: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onError = this.onError.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onDobChange = this.onDobChange.bind(this);
        this.onTsAndCsChange = this.onTsAndCsChange.bind(this);
        this.hasErrorItems = this.hasErrorItems.bind(this);
    }

    componentDidMount() {
        document.title = 'Activate your account | National Careers Service';
    }

    onError(errors) {
        Object.keys(errors).forEach((key) => {
            const found = this.state.errors.some(el => {
                return el.id === errors[key].id;
            });
            if (!found){               
                this.state.errors.push(errors[key]);
            }
        });
    }

    onPasswordChange(value) {
        this.setState({ password: value });
    }

    onDobChange(dobValues) {
        this.setState({ dobDay: dobValues.day });
        this.setState({ dobMonth: dobValues.month });
        this.setState({ dobYear: dobValues.year });
    }

    onTsAndCsChange(tsAndCsAccepted) {
        this.setState({ tsAndCsAccepted: tsAndCsAccepted });
    }

    handleSubmit(e) {
        e.preventDefault();
        //do something to validate and decide if we submit or show errors
        if (this.state.password &&
            this.state.dobDay &&
            this.state.dobMonth &&
            this.state.dobYear &&
            this.state.tsAndCsAccepted) {
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
        document.getElementById('day').value = this.state.dobDay;
        document.getElementById('month').value = this.state.dobMonth;
        document.getElementById('year').value = this.state.dobYear;
        document.getElementById('tncCheckbox_true').checked = this.state.tsAndCsAccepted;
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
                                    <components.CreateNewPassword onChange={this.onPasswordChange} onError={this.onError} showErrors={this.state.showErrors} />
                                    <p className="govuk-body">As an extra security check, enter your date of birth.</p>
                                    <components.DateOfBirth onChange={this.onDobChange} onError={this.onError} showErrors={this.state.showErrors} />
                                    <components.TermsAndConditions onChange={this.onTsAndCsChange} onError={this.onError} showErrors={this.state.showErrors} />
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