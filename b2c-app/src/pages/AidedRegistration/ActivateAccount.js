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
    }

    componentDidMount() {
        document.getElementById('api').style.display = 'none';
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

    onTsAndCsChange(value) {
        this.setState({ tsAndCsAccepted: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        //update error messages
        this.state.errors.forEach( (error) => {
            error.visibleMessage = error.currentMessage;
        });
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
            this.setState({ showErrors: true });
        }
    }

    setDataAndSubmit() {        
        //retrieve all elements we will need and set their values
        let b2cPassword = document.getElementById('newPassword');
        let b2cReenteredPassword = document.getElementById('reenterPassword');
        let b2cDobDay = document.getElementById('day');
        let b2cDobMonth = document.getElementById('month');
        let b2cDobYear = document.getElementById('year');
        let b2cTermsAndConditions = document.getElementById('tncCheckbox_true');
        let b2cSubmitButton = document.getElementById('continue');

        if(b2cPassword && b2cReenteredPassword &&
            b2cDobYear && b2cDobMonth && b2cDobYear &&
            b2cTermsAndConditions && 
            b2cSubmitButton){
                b2cPassword.value = this.state.password;
                b2cReenteredPassword.value = this.state.password;
                b2cDobDay.value = this.state.dobDay;
                b2cDobMonth.value = this.state.dobMonth;
                b2cDobYear.value = this.state.dobYear;
                b2cTermsAndConditions.checked = this.state.tsAndCsAccepted;
                //submit B2C form
                b2cSubmitButton.click();
            }
    }

    render() {

        return (
            <div id="activateAccount">

                <div className="govuk-width-container">
                    <components.Breadcrumbs />

                    <components.PageLevelErrorContainer errorItems={this.state.errors} summaryTextContent={<components.PasswordHelp />} />

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
                            </div>
                        </div>
                    </main>

                </div>

            </div>
        )
    }
}

export default ActivateAccount;