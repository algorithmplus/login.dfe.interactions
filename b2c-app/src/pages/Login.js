import React from 'react';
import components from '../components';

export default function Login() {
    return (
        
        <div id="login">
            <components.Header />
            <div class="govuk-width-container">
                <components.Breadcrumbs />

                <div class="govuk-width-container ">
                    <main class="govuk-main-wrapper " id="main-content" role="main">
                        <div class="govuk-grid-row">
                            <div class="govuk-grid-column-one-half">
                                <components.PageTitle size='l' title='Sign in'/>
                                {/* <components.B2C /> */}
                            </div>
                            <div class="govuk-grid-column-one-half">
                                <components.PageTitle size='l' title='Create an account'/>
                                <p class="govuk-body">
                                    <a href="./signup" class="govuk-link">Creating an account</a>
                                    &nbsp;allows you to access your adviser created action plans and save your:
                                </p>
                                <ul class="govuk-list govuk-list--bullet">
                                    <li>course searches</li>
                                    <li>Skills health check reports</li>
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>
                
            </div>
            <components.Footer />
        </div>
    )
}
