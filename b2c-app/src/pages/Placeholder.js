import React from 'react';
import components from '../components';

export default function Placeholder() {
    return (
        <div id="placeholder">

            <div className="govuk-width-container">
                <components.Breadcrumbs />

                {/* <div id="pageLevelErrorContainer"></div> */}

                <main className="govuk-main-wrapper">
                    {/* <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <components.B2C />
                        </div>
                    </div> */}
                </main>

            </div>

        </div>
    )
}
