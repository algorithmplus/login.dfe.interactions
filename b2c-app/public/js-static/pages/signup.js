(function () {

    var Controller = function Controller() {

        var self = this;

        /**
         * Callback that will look for class changes to show/hide item level errors
         * and add or remove the govuk-form-group--error class to the parent 
         * -- We find this behaviour to show/hide errors in signup page
        */
        this.tsAndCsErrorCallback = function tsAndCsErrorCallback(mutationsList, observer) {
            for (var mutation of mutationsList) {

                if (mutation.target.nextElementSibling && mutation.target.nextElementSibling.id === 'tncCheckbox_true') {

                    if (mutation.type === 'attributes' &&
                        mutation.attributeName === 'class' &&
                        mutation.target.classList.contains('error') &&
                        mutation.target.classList.contains('itemLevel')
                    ) {
                        if (mutation.target.classList.contains('show')) {
                            //add class to highlight error
                            mutation.target.parentElement.parentElement.classList.add('govuk-form-group--error');
                            //show custom item level error
                            document.getElementById('tncErrorMessage').style.display = 'block';
                        }
                        else {
                            //remove class to highlight error
                            mutation.target.parentElement.parentElement.classList.remove('govuk-form-group--error');
                            //hide custom item level error
                            document.getElementById('tncErrorMessage').style.display = 'none';
                        }
                    }

                    //add/remove highlight from item level errors being added/removed
                    if (mutation.type === 'childList' &&
                        mutation.target.classList.contains('error') &&
                        mutation.target.classList.contains('itemLevel') &&
                        mutation.target.classList.contains('show')
                    ) {
                        if (mutation.removedNodes.length) {
                            //remove class to highlight error
                            mutation.target.parentElement.parentElement.classList.remove('govuk-form-group--error');
                            //show custom item level error
                            document.getElementById('tncErrorMessage').style.display = 'block';
                        }
                        else if (mutation.addedNodes.length) {
                            //add class to highlight error
                            mutation.target.parentElement.parentElement.classList.add('govuk-form-group--error');
                            //hide custom item level error
                            document.getElementById('tncErrorMessage').style.display = 'none';
                        }
                    }

                }

            }
        };

        this.observers = [
            new MutationObserver(this.tsAndCsErrorCallback)
        ];

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
                            <ul class="govuk-list govuk-list--bullet">
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
            this.newTsAndCsHeader = document.createElement('h1');
            this.newTsAndCsHeader.className = 'govuk-heading-m';
            this.newTsAndCsHeader.innerHTML = 'Terms and conditions';

            this.newTsAndCsBox = document.createElement('div');
            this.newTsAndCsBox.className = 'govuk-form-group';
            this.newTsAndCsBox.innerHTML = `
                <div id="tncErrorMessage" class="govuk-error-message" role="alert" style="display: none">You must accept our Terms and Conditions</div>
                <div class="attrEntry">
                    <div class="error itemLevel" role="alert" style="display: none"></div>
                    <input id="tncCheckbox_true" name="tncCheckbox" type="checkbox" value="true" />
                    <label for="tncCheckbox_true">I accept the 
                        <a href="https://nationalcareers.service.gov.uk/help/terms-and-conditions" target="_blank" rel="noopener noreferrer" >terms and conditions</a>
                        and I am 13 or over
                    </label>
                </div>
              `;

            //Add new Terms and Conditions element and remove the original one
            this.tsAndCsElement = document.getElementById('tncCheckbox_true');
            if (this.tsAndCsElement) {
                this.tsAndCsElement.parentNode.parentNode.insertBefore(this.newTsAndCsHeader, this.tsAndCsElement.parentNode);
                this.tsAndCsElement.parentNode.parentNode.insertBefore(this.newTsAndCsBox, this.tsAndCsElement.parentNode);
                this.tsAndCsElement.parentNode.parentNode.removeChild(this.tsAndCsElement.parentNode);
            }

            //observe changes into the Terms and Conditions element node coming from B2C
            self.targetNode = this.newTsAndCsBox;

            //options for the observer
            var observerConfig = { attributes: true, childList: true, subtree: true };

            self.observers.forEach(function (observer) {
                // Start observing the target node for configured mutations
                observer.observe(self.targetNode, observerConfig);
            });

            //set the common observers for B2C changes
            setB2CObservers();

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