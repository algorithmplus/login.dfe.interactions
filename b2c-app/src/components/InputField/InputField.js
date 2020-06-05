import React from 'react';

class InputField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            [this.props.inputId]: null,
            errors: {
                [this.props.inputId]: {
                    currentMessage: this.props.defaultErrorMessage,
                    visibleMessage: '',
                    id: this.props.inputId
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidInput = this.isValidInput.bind(this);

        //initialise errors in parent component, which will contain a reference to them
        props.onError(this.state.errors);

        //get reference to errors to keep code cleaner
        this.errors = this.state.errors[this.props.inputId];
    }

    handleChange(e) {
        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            this.props.onChange({
                [this.props.inputId]: this.isValidInput() ? value : null
            });
        });
    }

    isValidInput() {
        let isValid = true;

        //clear errors
        this.errors.currentMessage = '';

        //the only validation done is check that the input field is not empty
        if (!this.state[this.props.inputId]) {
            isValid = false;
            this.errors.currentMessage = this.props.defaultErrorMessage;
        }

        this.setState({ errors: this.errors });

        return isValid;
    }

    render() {

        const inputErrorElement = this.props.showErrors && this.errors.visibleMessage.length > 0 ?
            (
                <span id="inputError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {this.errors.visibleMessage}
                </span>
            ) :
            null;

        const inputHint = this.props.hint ?
            (
                <span id={`${this.props.inputId}-hint`} className="govuk-hint">
                    {this.props.hint}
                </span>
            ) :
            null;

        return (

            <div className={`govuk-form-group ${this.props.showErrors && this.errors.visibleMessage.length > 0 ? "govuk-form-group--error" : ""}`}>
                <label className="govuk-label" htmlFor={this.props.inputId}>
                    {this.props.inputLabel}
                </label>
                {inputErrorElement}
                {inputHint}
                <input className="govuk-input govuk-input--width-10" id={this.props.inputId} name={this.props.inputId} type="text" onChange={this.handleChange} noValidate />
            </div>
        )
    }
}

export default InputField;