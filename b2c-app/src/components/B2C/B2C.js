import React from 'react'

export default function b2c() {
    return (
        <div id="api" data-name="Unified">

            <form id="localAccountForm" action="JavaScript:void(0);" class="localAccount" aria-label="Sign in">                <div className="intro">
                <h2>
                        Sign in
                </h2>
                </div>
                <div className="error pageLevel" aria-hidden="true" style={{ display: 'none' }}>
                    <p role="alert"></p>
                </div>
                <div className="entry">
                    <div className="entry-item">
                        <label for="email">
                            Email address
                    </label>
                        <div className="error itemLevel" aria-hidden="true" style={{ display: 'none' }}>
                            <p role="alert"></p>
                        </div>
                        <input type="email" id="email" name="Email address" pattern="^[a-zA-Z0-9.!#$%&amp;’'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$" placeholder="Email address" value="" tabindex="1" />
                    </div>
                    <div className="entry-item">
                        <div className="password-label">
                            <label for="password">Password</label>
                        </div>
                        <div className="error itemLevel" aria-hidden="true" style={{ display: 'none' }}>
                            <p role="alert"></p>
                        </div>
                        <input type="password" id="password" name="Password" placeholder="Password" tabindex="1" />
                        <div className="forgot-password">
                            <a id="forgotPassword" tabindex="2" href="/devauthncs.onmicrosoft.com/B2C_1A_signin_invitation/api/CombinedSigninAndSignup/forgotPassword?csrf_token=Nnp4QVpydWdBNFFzVlV4TFpuZmE2SitmWWJWZGs2V1hKMm92blhoOXRuVExLMlVvSkt6UURQVkpxZ00xMmZNZVNER3RhTWZPUzRKSGwwREVxaTFzTmc9PTsyMDIwLTA1LTExVDE2OjA4OjQyLjk2Mzg2NDhaO0NEYWtKRmVTUE53ekVPR0dmTWZ5QVE9PTt7Ik9yY2hlc3RyYXRpb25TdGVwIjoxfQ==&amp;tx=StateProperties=eyJUSUQiOiJlZjBiNDhkOS1hYTRlLTQzYjctOTg3MC0zMWU2ZTZjODNjYmUifQ&amp;p=B2C_1A_signin_invitation">I can't access my account</a>
                        </div>
                    </div>
                    <div className="working"></div>
                    <div className="buttons">
                        <button id="next" tabindex="1">Sign in</button>
                    </div>
                </div>

            </form>
        </div>
    )
}
