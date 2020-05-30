import React from 'react'

function DateOfBirthInput() {

    return (
        <div className="govuk-form-group">
            <fieldset className="govuk-fieldset" role="group" aria-describedby="date-of-birth-hint" id="dobFieldset">
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                    <label className="govuk-label">
                        Date of birth
                    </label>
                </legend>
                <span id="dobCopyError" className="govuk-error-message" style={{ display: 'none' }}></span>
                <span id="date-of-birth-hint" className="govuk-hint">
                    For example, 31 3 1980
                </span>
                <div className="govuk-date-input" id="date-of-birth">
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" for="dayCopy">
                                Day
                            </label>
                            <input className="govuk-input govuk-date-input__input govuk-input--width-2" id="dayCopy" name="dayCopy" type="text" pattern="[0-9]*" inputmode="numeric" />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" for="monthCopy">
                                Month
                            </label>
                            <input className="govuk-input govuk-date-input__input govuk-input--width-2" id="monthCopy" name="monthCopy" type="text" pattern="[0-9]*" inputmode="numeric" />
                        </div>
                    </div>
                    <div className="govuk-date-input__item">
                        <div className="govuk-form-group">
                            <label className="govuk-label govuk-date-input__label" for="yearCopy">
                                Year
                            </label>
                            <input className="govuk-input govuk-date-input__input govuk-input--width-4" id="yearCopy" name="yearCopy" type="text" pattern="[0-9]*" inputmode="numeric" />
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    )

}

export default DateOfBirthInput;