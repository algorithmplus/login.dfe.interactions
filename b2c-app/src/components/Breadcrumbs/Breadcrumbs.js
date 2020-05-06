import React from 'react'

function Breadcrumbs(props) {
    return (
        <div className="govuk-breadcrumbs">
            <ol className="govuk-breadcrumbs__list">
                <li className="govuk-breadcrumbs__list-item">
                    <a className="govuk-breadcrumbs__link" href="./signup">Home</a>
                </li>
            </ol>
        </div>
    )
}

export default Breadcrumbs;