import React from 'react';

import "./TermsAndConditions.scss";

function TermsAndConditions() {

    return (

        <div>
            <h1 className='govuk-heading-m'>Terms and conditions</h1>
            <div className="govuk-form-group">
                <span id="termsAndConditionsCopyError" className="govuk-error-message" style={{ display: 'none' }}></span>
                <label className="block-label" for="termsAndConditionsCopy">
                    <input id="termsAndConditionsCopy" name="termsAndConditionsCopy" type="checkbox" value="true" aria-invalid="true" />
                    I accept the&nbsp;
                    <a href="https://nationalcareers.service.gov.uk/help/terms-and-conditions" id="termsAndConditionsLink" target="_blank">
                        terms and conditions
                    </a>
                    &nbsp;and I am 13 or over
                </label>
            </div>
        </div>
    )

}

export default TermsAndConditions;