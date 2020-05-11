import React from 'react';
import components from '../components';

import { getB2CLink } from '../helpers/urls';

export default function Login() {
    return (
        
        <div id="login">
            <div className="govuk-width-container">
                <components.Breadcrumbs />

                <div id="pageLevelErrorContainer"></div>

                <div className="govuk-width-container ">
                    <main className="govuk-main-wrapper " id="main-content" role="main">
                        <div className="govuk-grid-row">
                            <div className="govuk-grid-column-one-half">
                                <components.PageTitle size='l' title='Sign in'/>
                                <components.B2C />
                            </div>
                            <div className="govuk-grid-column-one-half">
                                <components.PageTitle size='l' title='Create an account'/>
                                <p className="govuk-body">
                                    <a href={getB2CLink('signup')} className="govuk-link">Creating an account</a>
                                    &nbsp;allows you to access your adviser created action plans and save your:
                                </p>
                                <ul className="govuk-list govuk-list--bullet">
                                    <li>course searches</li>
                                    <li>Skills health check reports</li>
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>
                
            </div>
        </div>
    )
}
