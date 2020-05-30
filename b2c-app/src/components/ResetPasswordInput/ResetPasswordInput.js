import React from 'react';

import components from '..';

function ResetPasswordInput() {

    return (

        <div>
            <div className="govuk-form-group">
                <label className="govuk-label" for="newPasswordCopy">
                    Create new password
                </label>
                <span id="newPasswordCopyError" className="govuk-error-message" style={{ display: 'none' }}></span>
                <input className="govuk-input govuk-!-width-one-half" id="newPasswordCopy" name="newPasswordCopy" type="password" />
            </div>

            <div className="govuk-form-group">
                <components.PasswordHelpContainer />
            </div>

            <div className="govuk-form-group">
                <label className="govuk-label" for="reenterPasswordCopy">
                    Re-type password
                </label>
                <span id="reenterPasswordCopyError" className="govuk-error-message" style={{ display: 'none' }}></span>
                <input className="govuk-input govuk-!-width-one-half" id="reenterPasswordCopy" name="reenterPasswordCopy" type="password" />
            </div>
        </div>

    )

}

export default ResetPasswordInput;