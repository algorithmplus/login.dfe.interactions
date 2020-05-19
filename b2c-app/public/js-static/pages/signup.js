(function () {

    var Controller = function Controller() {
        
        this.onDOMContentLoaded = function onDOMContentLoaded() {

            // manipulate the DOM so that we can include the password help item
            this._passWordHelp = document.createElement('div');
            /* eslint-disable */
            this._passWordHelp.innerHTML = `
                <details class="govuk-details govuk-!-margin-top-3" data-module="govuk-details">
                    <summary class="govuk-details__summary">
                            <span class="govuk-details__summary-text">
                            Help choosing a valid password
                            </span>
                    </summary>
                    <div class="govuk-details__text">
                            <p>Your password must be between 8 and 16 characters and contain 3 out of 4 of the following:</p>
                            <ul class="govuk-list govuk-list--bulllet">
                                <li>lowercase characters</li>
                                <li>uppercase characters</li>
                                <li>digits (0-9)</li>
                                <li>one or more of the following symbols: @ # $ % ^ & * - _ + = [ ] { } | \ : ' , ? / \` ~ " ( ) ; . </li>
                            </ul>
                    </div>
                </details>
              `;
            /* eslint-enable */

            //Add password help
            this._passwordElement = document.getElementById('newPassword');
            if (this._passwordElement) {
                this._passwordElement.parentNode.insertBefore(this._passWordHelp, this._passwordElement.nextSibling);
            }


            //manipulate the DOM to tweak the UI for Terms and Conditions box
            this.newTsAndCs = `
                <h1 class="govuk-heading-m">Terms and conditions</h1>
                <div class="govuk-form-group">
                    <div class="error itemLevel" role="alert"></div>
                    <div class="attrEntry">
                        <input id="tncCheckbox_true" name="tncCheckbox" type="checkbox" value="true" />
                        <label for="tncCheckbox_true">I accept the 
                        <a href="https://nationalcareers.service.gov.uk/help/terms-and-conditions" target="_blank">terms and conditions</a>
                        and I am 13 or over</label>
                    </div>
                </div>
              `;

            this.tsAndCsElement = document.getElementById('tncCheckbox_true');
            if(this.tsAndCsElement){
                this.tsAndCsElement.parentNode.parentNode.innerHTML = this.newTsAndCs;
            }
            
        };

        this.init = function init() {
            document.title = 'Create an account | National Careers Service';

            if (document.readyState === "complete"
                || document.readyState === "loaded"
                || document.readyState === "interactive") {

                // document has at least been parsed, go and tweak the template received by B2C
                this.onDOMContentLoaded();
            }
            else {
                document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded);
            }

        };

    }

    new Controller().init();

})();