import React from 'react'
import './B2C.scss'

export default function b2c() {
    return (
        // <div id="api"></div>

        <div id="api" data-name="SelfAsserted">
            <div className="intro">
                <p>Please provide the following details.</p>
            </div>
            <div id="attributeVerification" role="form">
                <div className="error pageLevel" id="passwordEntryMismatch" style={{display: 'none'}} aria-hidden="true">The password entry fields do not match. Please enter the same password in both fields and try again.</div>
                <div className="error pageLevel" id="requiredFieldMissing" style={{display: 'none'}} aria-hidden="true">A required field is missing. Please fill out all required fields and try again.</div>
                <div className="error pageLevel" id="fieldIncorrect" style={{display: 'none'}} aria-hidden="true">One or more fields are filled out incorrectly. Please check your entries and try again.</div>
                <div className="error pageLevel" id="claimVerificationServerError" style={{display: 'none'}} aria-hidden="true"></div>
                
                <div className="attr" id="attributeList">
                    <ul>
                        <li className="TextBox">
                            <div className="attrEntry">
                                <label htmlFor="givenName">First name</label>
                                <div className="error itemLevel" aria-hidden="true"><p>This information is required.</p></div>
                                <input id="givenName" className="textInput" type="text" placeholder="First name" title="Your given name (also known as first name)." required="" aria-required="true" aria-label="This information is required., First name" />
                                <a href="javascript:void(0)" data-help="Your given name (also known as first name)." className="helpLink tiny">What is this?</a>
                            </div>
                        </li>
                        <li className="TextBox">
                            <div className="attrEntry">
                                <label htmlFor="surname">Last name</label>
                                <div className="error itemLevel" aria-hidden="true"><p>This information is required.</p></div>
                                <input id="surname" className="textInput" type="text" placeholder="Last name" title="Your surname (also known as family name or last name)." required="" aria-required="true" aria-label="This information is required., Last name" />
                                <a href="javascript:void(0)" data-help="Your surname (also known as family name or last name)." className="helpLink tiny">What is this?</a>
                            </div>
                        </li>
                        <li className="TextBox">
                            <div className="attrEntry">
                                <label htmlFor="email">Email address</label>
                                <div className="error itemLevel" aria-hidden="true"><p>Please enter a valid email address.</p></div>
                                {/* THIS IS NOT PART OF THE OUT OF THE BOX UI */}
                                <span id="account-number-hint" className="govuk-hint">
                                    You'll need this to sign in to your account
                                </span>
                                {/* END THIS IS NOT PART OF THE OUT OF THE BOX UI */}
                                <input id="email" className="textInput" type="text" placeholder="Email address" pattern="^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$" title="Email address that can be used to contact you." required="" aria-required="true" aria-label="Please enter a valid email address., Email address" />
                                <a href="javascript:void(0)" data-help="Email address that can be used to contact you." className="helpLink tiny">What is this?</a>
                            </div>
                        </li>
                        <li className="Password">
                            <div className="attrEntry">
                                <label htmlFor="newPassword">Create password</label>
                                <div className="error itemLevel" aria-hidden="true"><p>8-16 characters, containing 3 out of 4 of the following: Lowercase characters, uppercase characters, digits (0-9), and one or more of the following symbols: @ # $ % ^ &amp; * - _ + = [ ] { } | \ : ' , ? / ` ~ " ( ) ; .</p></div>
                                <input id="newPassword" className="textInput" type="password" placeholder="Create password" pattern="^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&amp;*\-_+=[\]{}|\\:',?/`~&quot;();!]|\.(?!@)){8,16}$" title="Enter new password" required="" aria-required="true" aria-label="8-16 characters, containing 3 out of 4 of the following: Lowercase characters, uppercase characters, digits (0-9), and one or more of the following symbols: @ # $ % ^ &amp; * - _ + = [ ] { } | \ : ' , ? / ` ~ &quot; ( ) ; ., Create password" />
                                <a href="javascript:void(0)" data-help="Enter new password" className="helpLink tiny">What is this?</a>
                            </div>
                        </li>
                        <li className="Password">
                            <div className="attrEntry">
                                <label htmlFor="reenterPassword">Re-type password</label>
                                <div className="error itemLevel" aria-hidden="true"><p> </p></div>
                                <input id="reenterPassword" className="textInput" type="password" placeholder="Re-type password" pattern="^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&amp;*\-_+=[\]{}|\\:',?/`~&quot;();!]|\.(?!@)){8,16}$" title="Confirm new password" required="" aria-required="true" aria-label=" , Re-type password" />
                                <a href="javascript:void(0)" data-help="Confirm new password" className="helpLink tiny">What is this?</a>
                            </div>
                        </li>
                        <li className="CheckboxMultiSelect">
                            <div className="attrEntry">
                                {/* TODO need to check if this can be removed */}
                                {/* <label htmlFor="tncCheckbox"></label> */}
                                <div className="error itemLevel" aria-hidden="true"><p>This information is required.</p></div>
                                <input id="tncCheckbox_true" name="tncCheckbox" type="checkbox" value="true" autoFocus="" />
                                <label htmlFor="tncCheckbox_true">I accept the terms and conditions and I am 13 or over</label>
                                <a href="javascript:void(0)" data-help="" className="helpLink tiny">What is this?</a>
                            </div>
                            {/* <div className="govuk-checkboxes govuk-checkboxes--small">
                                <div className="govuk-checkboxes__item">
                                    <input className="govuk-checkboxes__input" id="organisation" name="organisation" type="checkbox" value="hmrc" />
                                    <label className="govuk-label govuk-checkboxes__label" htmlFor="organisation">
                                    HM Revenue and Customs (HMRC)
                                    </label>
                                </div>
                            </div> */}
                        </li>
                    </ul>
                </div>
                <div className="buttons">
                    <button id="continue" aria-label="Create">Create</button>
                    <button id="cancel" aria-label="Cancel" formNoValidate="">Cancel</button>
                </div>

                <div className="verifying-modal">
                    <div id="verifying_blurb"></div>
                </div>
            </div>
        </div>
    )
}
