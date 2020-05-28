import React from 'react';

function PageLevelErrorContainer(props) {

    return (
        <div id="pageLevelErrorContainer" style={{ display: 'none' }}>
            <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
                <h2 class="govuk-error-summary__title" id="error-summary-title">
                    There is a problem
                </h2>
                <div id="errorSummaryText" style={{ display: 'none' }}>
                    {props.summaryTextContent && ( props.summaryTextContent )}
                </div>
                <div class="govuk-error-summary__body">
                    <ul id="errorSummaryItems" class="govuk-list govuk-error-summary__list">
                        {/* we will add children here when errors occur */}
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default PageLevelErrorContainer;