import React from 'react'

function Breadcrumbs(props) {
    return (
        <div className="govuk-breadcrumbs">
            <ol className="govuk-breadcrumbs__list">
                <li className="govuk-breadcrumbs__list-item">
                    <a className="govuk-breadcrumbs__link" href="./login">Home</a>
                </li>
                <li className="govuk-breadcrumbs__list-item">
                    <a className="govuk-breadcrumbs__link" href="./login">Another Page</a>
                </li>
                <li className="govuk-breadcrumbs__list-item" aria-current="page">Current Page</li>
            </ol>
        </div>
    )
}

export default Breadcrumbs;