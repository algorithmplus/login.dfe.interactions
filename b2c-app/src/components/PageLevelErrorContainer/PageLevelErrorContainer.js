import React from 'react';

function PageLevelErrorContainer(props) {

    const errorItems = props.errorItems ?
        props.errorItems.map(error => {
            return error ?
                (
                    <li key={error.id}>
                        <a href={`#${error.id}`}>{error.message}</a>
                    </li>
                ) :
                ''
        }) :
        '';
    

    return (
        <div id="pageLevelErrorContainer">
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1" data-module="govuk-error-summary">
                <h2 className="govuk-error-summary__title" id="error-summary-title">
                    There is a problem
                </h2>
                <div id="errorSummaryText" style={{ display: 'none' }}>
                    {props.summaryTextContent && ( props.summaryTextContent )}
                </div>
                <div className="govuk-error-summary__body">
                    <ul id="errorSummaryItems" className="govuk-list govuk-error-summary__list">
                        {errorItems}
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default PageLevelErrorContainer;