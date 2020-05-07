import React from 'react'

export default function b2c() {
    return (
        // <div id="api">
        
        // </div>

        <div>

            {/* <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1" data-module="govuk-error-summary">
                <h2 className="govuk-error-summary__title" id="error-summary-title">
                    There is a problem
                </h2>
                <div className="govuk-error-summary__body">
                    <ul className="govuk-list govuk-error-summary__list">
                    <li>
                        <a href="#passport-issued-error">The date your passport was issued must be in the past</a>
                    </li>
                    <li>
                        <a href="#postcode-error">Enter a postcode, like AA1 1AA</a>
                    </li>
                    </ul>
                </div>
            </div> */}

            <div className="error pageLevel" aria-hidden="true">
                <p role="alert">Missing required element [Email address]</p>
            </div>
            <div className="entry">
                <div className="entry-item">
                    <label htmlFor="signInName">
                    Email address
                    </label>
                    <div className="error itemLevel" aria-hidden="true" style={{display: 'none'}}>
                        <p role="alert"></p>
                    </div>
                    <input type="text" id="signInName" name="Sign in name" placeholder="Username" value="" tabIndex="1" />
                </div>
                <div className="entry-item">
                    <div className="password-label">
                    <label htmlFor="password">Password</label>
                    <a id="forgotPassword" tabIndex="2" href="/devauthncs.onmicrosoft.com/B2C_1A_signin_invitation/api/CombinedSigninAndSignup/forgotPassword?csrf_token=RnlXbTlNQXZjVk5RZG1zYVNtdDJGZ3FWdUJKS1BhUEdkMERqUnpFa0dNTnVvdkw4dEs4N0VtblBHS2o2bjg3NW5tMXlDUTNGWW96Nzh1azdQUUNjbGc9PTsyMDIwLTA1LTA2VDEwOjUyOjUxLjk4MzQyNjNaO256ZGpvazlBUlNMSU9oajROQXAyREE9PTt7Ik9yY2hlc3RyYXRpb25TdGVwIjoxfQ==&amp;tx=StateProperties=eyJUSUQiOiJkMjJiY2JhZS0zMWI1LTQ0ZWEtODdiNy05ZDkzZjg0MzVlZjYifQ&amp;p=B2C_1A_signin_invitation">I can't access my account</a>
                    </div>
                    <div className="error itemLevel" aria-hidden="true" style={{display: 'none'}}>
                    <p role="alert"></p>
                    </div>
                    <input type="password" id="password" name="Password" placeholder="Password" tabIndex="1" />
                </div>
                <div className="working"></div>
                <div className="buttons">
                    <button id="next" tabIndex="1">Sign in</button>
                </div>
            </div>

        </div>
    )
}
