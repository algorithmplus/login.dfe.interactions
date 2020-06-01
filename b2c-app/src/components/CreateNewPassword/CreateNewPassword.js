import React from 'react';

import components from '..';

class CreateNewPassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newPassword: null,
            reenteredPassword: null,
            errors: {
                newPassword: '',
                reenteredPassword: ''
            }
        };
        this.onChange = props.onChange;
    }

    handleChange = (event) => {
        console.log('handle change');

        event.preventDefault();

        const { name, value } = event.target;

        console.log('validate');

        this.setState({ [name]: value }, () => {
            console.log('state updated in component');
            if (this.isValidPassword()) {
                //update data in the page state
                this.onChange(value);
            }
        });
    }

    isValidPassword = () => {
        let isValid = true;
        let password = this.state.newPassword;
        let reenteredPassword = this.state.reenteredPassword;
        let errors = this.state.errors;

        //clear errors
        errors.newPassword = '';
        errors.reenteredPassword = '';

        if (!password || password === '') {
            isValid = false;
            errors.newPassword = 'Enter your password';
        }
        else if (password.length < 8 || password.length > 16) {
            isValid = false;
            errors.newPassword = 'Enter between 8 and 16 characters';
        }
        //run validation as it has been set up in B2C (default values as suggested here: https://msdn.microsoft.com/en-us/library/azure/jj943764.aspx )
        // eslint-disable-next-line
        else if (!password.match(/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&*\-_+=[\]{}|\\:',?\/`~"();!]|\.(?!@)){8,16}$/)) {
            isValid = false;
            errors.newPassword = 'Invalid password';
        }
        else if (reenteredPassword === '') {
            isValid = false;
            errors.reenteredPassword = 'Re-enter your password';
        }

        else if (reenteredPassword !== '' && password !== reenteredPassword) {
            isValid = false;
            errors.reenteredPassword = 'Your passwords do not match';
        }

        this.setState({errors});

        return isValid;
    }

    render() {

        const { errors } = this.state;

        return (

            <div>
                <div className={`govuk-form-group ${errors.newPassword.length > 0 ? "govuk-form-group--error" : ""}`}>
                    <label className="govuk-label" htmlFor="newPassword">
                        Create new password
                    </label>
                    {errors.newPassword.length > 0 && (
                        <span id="newPasswordError" className="govuk-error-message">
                            <span className="govuk-visually-hidden">Error:</span>
                            {errors.newPassword}
                        </span>
                    )}
                    <input className="govuk-input govuk-!-width-one-half" id="newPassword" name="newPassword" type="password" onChange={this.handleChange} noValidate />
                </div>

                <div className="govuk-form-group">
                    <components.PasswordHelpContainer />
                </div>

                <div className={`govuk-form-group ${errors.reenteredPassword.length > 0 ? "govuk-form-group--error" : ""}`}>
                    <label className="govuk-label" htmlFor="reenterPreenteredPasswordassword">
                        Re-type password
                    </label>
                    {errors.reenteredPassword.length > 0 && (
                        <span id="reenteredPasswordError" className="govuk-error-message">
                            <span className="govuk-visually-hidden">Error:</span>
                            {errors.reenteredPassword}
                        </span>
                    )}
                    <input className="govuk-input govuk-!-width-one-half" id="reenteredPassword" name="reenteredPassword" type="password" onChange={this.handleChange} noValidate />
                </div>
            </div>

        )
    }
}

export default CreateNewPassword;