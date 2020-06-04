import React from 'react';

import components from '..';

class CreateNewPassword extends React.Component {

    state = {
        newPassword: null,
        reenteredPassword: null,
        errors: {
            newPassword: {
                currentMessage: 'Enter your password',
                visibleMessage: '',
                id: 'newPasswordCustom'
            },
            reenteredPassword: {
                currentMessage: '',
                visibleMessage: '',
                id: 'reenteredPasswordCustom'
            }
        }
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.isValidPassword = this.isValidPassword.bind(this);

        //initialise errors in parent component, which will contain a reference to them
        props.onError(this.state.errors);
    }

    handleChange(e) {
        e.preventDefault();

        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            this.isValidPassword() ? this.props.onChange(value) : this.props.onChange(null);
        });
    }

    isValidPassword() {
        let isValid = true;
        let password = this.state.newPassword;
        let reenteredPassword = this.state.reenteredPassword;
        let errors = this.state.errors;

        //clear errors
        errors.newPassword.currentMessage = '';
        errors.newPassword.showSummaryText = false;
        errors.reenteredPassword.currentMessage = '';

        if (!password || password === '') {
            isValid = false;
            errors.newPassword.currentMessage = 'Enter your password';
        }
        else if (password.length < 8 || password.length > 16) {
            isValid = false;
            errors.newPassword.currentMessage = 'Enter between 8 and 16 characters';
        }
        //run validation as it has been set up in B2C (default values as suggested here: https://msdn.microsoft.com/en-us/library/azure/jj943764.aspx )
        // eslint-disable-next-line
        else if (!password.match(/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&*\-_+=[\]{}|\\:',?\/`~"();!]|\.(?!@)){8,16}$/)) {
            isValid = false;
            errors.newPassword.currentMessage = 'Invalid password';
            errors.newPassword.showSummaryText = true;
        }
        else if (reenteredPassword === '') {
            isValid = false;
            errors.reenteredPassword.currentMessage = 'Re-enter your password';
        }

        else if (reenteredPassword !== '' && password !== reenteredPassword) {
            isValid = false;
            errors.reenteredPassword.currentMessage = 'Your passwords do not match';
        }

        this.setState({ errors });

        return isValid;
    }

    render() {

        const { errors } = this.state;

        const newPasswordErrorElement = this.props.showErrors && errors.newPassword.visibleMessage.length > 0 ?
            (
                <span id="newPasswordError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {errors.newPassword.visibleMessage}
                </span>
            ) :
            null;

        const reenteredPasswordErrorElement = this.props.showErrors && errors.reenteredPassword.visibleMessage.length > 0 ?
            (
                <span id="reenteredPasswordError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {errors.reenteredPassword.visibleMessage}
                </span>
            ) :
            null;

        return (

            <div>
                <div className={`govuk-form-group ${this.props.showErrors && errors.newPassword.visibleMessage.length > 0 ? "govuk-form-group--error" : ""}`}>
                    <label className="govuk-label" htmlFor="newPasswordCustom">
                        Create new password
                    </label>
                    {newPasswordErrorElement}
                    <input className="govuk-input govuk-!-width-one-half" id="newPasswordCustom" name="newPassword" type="password" onChange={this.handleChange} noValidate />
                </div>

                <div className="govuk-form-group">
                    <components.PasswordHelpContainer />
                </div>

                <div className={`govuk-form-group ${this.props.showErrors && errors.reenteredPassword.visibleMessage.length > 0 ? "govuk-form-group--error" : ""}`}>
                    <label className="govuk-label" htmlFor="reenteredPasswordCustom">
                        Re-type password
                    </label>
                    {reenteredPasswordErrorElement}
                    <input className="govuk-input govuk-!-width-one-half" id="reenteredPasswordCustom" name="reenteredPassword" type="password" onChange={this.handleChange} noValidate />
                </div>
            </div>

        )
    }
}

export default CreateNewPassword;