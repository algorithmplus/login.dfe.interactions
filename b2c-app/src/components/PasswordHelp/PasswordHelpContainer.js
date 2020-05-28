import React from 'react';

import components from '../../components';

function PasswordHelpContainer() {

    return (

        <details class="govuk-details">
            <summary class="govuk-details__summary">
                <span class="govuk-details__summary-text">
                    Help choosing a valid password
                </span>
            </summary>
            <div class="govuk-details__text">
                <components.PasswordHelp />
            </div>
        </details>

    )

}

export default PasswordHelpContainer;