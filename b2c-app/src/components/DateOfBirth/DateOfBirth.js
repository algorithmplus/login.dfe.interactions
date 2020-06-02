import React from 'react';

class DateOfBirth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dobDay: null,
            dobMonth: null,
            dobYear: null,
            errors: {
                dob: {
                    currentMessage: 'Enter date of birth',
                    visibleMessage: '',
                    id: 'dobFieldset'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidDob = this.isValidDob.bind(this);

        //initialise errors in parent component, which will contain a reference to them
        props.onError(this.state.errors);
    }

    handleChange(e) {
        e.preventDefault();

        const { name, value } = e.target;

        this.setState({ [name]: value }, () => {
            if (this.isValidDob()) {
                //update data in the page state
                this.props.onChange({
                    day: this.state.dobDay,
                    month: this.state.dobMonth,
                    year: this.state.dobYear
                });
            }
        });
    }

    isValidDob() {
        let isValid = true;
        let day = this.state.dobDay;
        let month = this.state.dobMonth;
        let year = this.state.dobYear;
        let errors = this.state.errors;

        //clear errors
        errors.dob.currentMessage = '';

        if (!day && !month && !year) {
            isValid = false;
            errors.dob.currentMessage = 'Enter date of birth';
        }
        else {
            //get value for month ready to be used by Date functions
            month = month - 1;
    
            //validate the date input
            var inputDate = new Date(year, month, day);
    
            if (isNaN(inputDate.getTime()) ||
                inputDate.getMonth() !== month //this one would mean user entered 29th of a month in a non leap year
            ) {
                //failed validation, show an error and prevent submit
                isValid = false;
                errors.dob.currentMessage = 'Enter a valid date of birth';
            }
        }

        this.setState({ errors });

        return isValid;
    }

    render() {

        const { errors } = this.state;

        const dobErrorElement = this.props.showErrors && errors.dob.visibleMessage.length > 0 ?
            (
                <span id="dobError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {errors.dob.visibleMessage}
                </span>
            ) :
            null;

        return (
            <div className={`govuk-form-group ${this.props.showErrors && errors.dob.visibleMessage.length > 0 ? "govuk-form-group--error" : ""}`}>
                <fieldset className="govuk-fieldset" role="group" aria-describedby="date-of-birth-hint" id="dobFieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <label className="govuk-label">
                            Date of birth
                        </label>
                    </legend>
                    {dobErrorElement}
                    <span id="date-of-birth-hint" className="govuk-hint">
                        For example, 31 3 1980
                    </span>
                    <div className="govuk-date-input" id="date-of-birth">
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <label className="govuk-label govuk-date-input__label" htmlFor="dobDay">
                                    Day
                                </label>
                                <input className="govuk-input govuk-date-input__input govuk-input--width-2" id="dobDay" name="dobDay" type="number" pattern="[0-9]*" inputMode="numeric" onChange={this.handleChange} noValidate />
                            </div>
                        </div>
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <label className="govuk-label govuk-date-input__label" htmlFor="dobMonth">
                                    Month
                                </label>
                                <input className="govuk-input govuk-date-input__input govuk-input--width-2" id="dobMonth" name="dobMonth" type="number" pattern="[0-9]*" inputMode="numeric" onChange={this.handleChange} noValidate />
                            </div>
                        </div>
                        <div className="govuk-date-input__item">
                            <div className="govuk-form-group">
                                <label className="govuk-label govuk-date-input__label" htmlFor="dobYear">
                                    Year
                                </label>
                                <input className="govuk-input govuk-date-input__input govuk-input--width-4" id="dobYear" name="dobYear" type="number" pattern="[0-9]*" inputMode="numeric" onChange={this.handleChange} noValidate />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        )
    }
}

export default DateOfBirth;