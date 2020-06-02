import React from 'react';

function PageLevelErrorContainer(props) {

    let showSummaryText = function(){
        return props.errorItems.some( item => {
            return item.showSummaryText;
        });
    };

    const errorItems = props.errorItems ?
        props.errorItems.map(error => {
            return error ?
                (
                    <li key={error.id}>
                        <a href={`#${error.id}`}>{error.visibleMessage}</a>
                    </li>
                ) :
                null
        }) :
        null;

    const errorSummary = props.summaryTextContent && showSummaryText() ?
        (
            <div id="errorSummaryText">
                {props.summaryTextContent}
            </div>
        ) :
        null;

    return (
        <div id="pageLevelErrorContainer">
            <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1" data-module="govuk-error-summary">
                <h2 className="govuk-error-summary__title" id="error-summary-title">
                    There is a problem
                </h2>
                {errorSummary}
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