(function () {
    var Controller = function Controller() {
        this.attrCallback = function attrCallback(mutationsList, observer) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'style' &&
                    mutation.target.classList.contains('error') &&
                    mutation.target.classList.contains('itemLevel')
                ) {
                    if (mutation.target.style.display === 'none') {
                        mutation.target.parentElement.classList.remove('govuk-form-group--error');
                    }
                    else {
                        mutation.target.parentElement.classList.add('govuk-form-group--error');
                    }
                }
            }

            this.refreshErrors(mutation);
        }

        this.classCallback = function classCallback(mutationsList, observer) {
            for (var mutation of mutationsList) {

                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.target.classList.contains('error') &&
                    mutation.target.classList.contains('itemLevel') &&
                    mutation.target.classList.contains('show')
                ) {
                    //add class to highlight error
                    mutation.target.parentElement.classList.add('govuk-form-group--error');
                }
            }

            this.refreshErrors(mutation);
        }

        this.refreshErrors = function refreshErrors(mutation) {
            //Determine if we will need to refresh the page level errors after the loop
            if (!refreshErrorsRequired &&
                mutation.target.classList.contains('error') &&
                mutation.target.classList.contains('pageLevel')
            ) {
                this.onPageErrorsUpdate();
            }
        }

        // Create an observer instance linked to the callback function
        this.observers = [
            new MutationObserver(this.attrCallback),
            new MutationObserver(this.classCallback),
        ];

        this.onDOMContentLoaded = function onDOMContentLoaded() {
            //Replace placeholder for redirect URI in all the links
            var queryParams = (new URL(document.location)).searchParams;
            var redirectURI = queryParams.get("redirect_uri");

            if (redirectURI) {
                var links = document.querySelectorAll("a[href^='authorize?']");
                links.forEach(function (item) {
                    item.href = item.href.replace(/__redirectURI__/g, redirectURI);
                });
            }


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

            this.targetNode = document.getElementById('api');
        }

        this.observe = function observe() {
            if (document.readyState === "complete"
                || document.readyState === "loaded"
                || document.readyState === "interactive") {

                // document has at least been parsed, go and tweak the template received by B2C
                this.onDOMContentLoaded();
            }
            else {
                document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded);
            }

            for (var observer of this.observers) {
                // Start observing the target node for configured mutations
                observer.observe(this.targetNode, config);
            }
        }
    }

    new Controller();

})();