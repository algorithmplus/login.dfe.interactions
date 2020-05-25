(function () {

    var Controller = function Controller() {

        var self = this;

        //B2C form items
        this.form = null;
        this.emailElement = null;
        this.passwordElement = null;
        this.submitButton = null;
        //Form copy items
        this.formCopy = null;
        this.emailCopyElement = null;
        this.passwordCopyElement = null;
        this.forgotPasswordCopyElement = null;

        //Item level errors
        this.emailCopyError = null;
        this.passwordCopyError = null;
        this.itemLevelErrors = null; //array used to clear errors easily

        //Page level errors
        this.pageLevelErrorContainer = null;
        this.errorSummaryItems = null;

        //function to show item level errors
        this.showItemAndPageLevelError = function (message, itemLevelElem, itemId) {
            if(itemLevelElem){
                itemLevelElem.innerHTML = `<span class="govuk-visually-hidden">Error:</span>${message}`;
                itemLevelElem.style.display = 'block';
                itemLevelElem.parentNode.classList.add('govuk-form-group--error');

                //page level error
                var pageError = document.createElement('LI');
                pageError.innerHTML = `<a href="#${itemId}">${message}</a>`
                self.errorSummaryItems.appendChild(pageError);
                self.pageLevelErrorContainer.style.display = 'block';
            }        
        };

        this.clearPageLevelErrors = function(){
            self.pageLevelErrorContainer.style.display = 'none';
            self.errorSummaryItems.innerHTML = '';
        };

        this.clearItemLevelErrors = function(){
            self.itemLevelErrors.forEach(function(itemLevelElem){
                itemLevelElem.style.display = 'none';
                itemLevelElem.parentNode.classList.remove('govuk-form-group--error');
            });
        };

        //function to handle our own validation before calling the actual submit (in B2C continue button)
        this.onBeforeSubmit = function (event) {

            event.preventDefault();

            //flag used to determine if submit should go ahead or not
            var valid = true;

            //clear errors
            self.clearPageLevelErrors();
            self.clearItemLevelErrors();

            //validate email
            if (self.emailCopyElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Enter your email', self.emailCopyError, self.emailCopyElement.id);
            }

            //validate password
            if (self.passwordCopyElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Enter your password', self.passwordCopyError, self.passwordCopyElement.id);
            }

            //if no errors, submit actually happens
            if (valid) {
                self.emailElement.value = self.emailCopyElement.value;
                self.passwordElement.value = self.passwordCopyElement.value;
                self.submitButton.click(event);
            }
            else{
                return false;
            }
        };


        /**
         * Callback that will look for class changes to show/hide page level errors
         */
        this.pageLevelErrorCallback = function pageLevelErrorCallback(mutationsList, observer) {
            //flag to see if we have to refresh page level errors
            var refreshErrorsRequired = false;

            //loop through mutated objects to run crazy logic and update the UI accordingly
            for (var mutation of mutationsList) {

                //Determine if we will need to refresh the page level errors after the loop
                if (!refreshErrorsRequired &&
                    mutation.target.classList.contains('error') &&
                    mutation.target.classList.contains('pageLevel')
                ) {
                    refreshErrorsRequired = true;
                }
            }

            //refresh the page level errors if there was at least one included
            if (refreshErrorsRequired) {
                self.refreshPageLevelErrors();
            }
        };

        this.refreshPageLevelErrors = function refreshPageLevelErrors() {

            //get all page level error elements
            this._pageErrors = document.getElementsByClassName('error pageLevel');

            // find out how many of these errors are visible
            var numVisibleItems = Array.from(this._pageErrors).filter(function (item) {
                return item.style.display !== 'none';
            }).length;

            // only add the error summary if there is at least one error visible
            if (numVisibleItems > 0) {

                //add all page level errors to the list
                Array.from(this._pageErrors).forEach((errorItem) => {
                    //and add each page level error as list items
                    var pageError = document.createElement('LI');
                    pageError.appendChild(errorItem);
                    self.errorSummaryItems.appendChild(pageError);
                    self.pageLevelErrorContainer.style.display = 'block';
                });
            }
        };

        
        this.onDOMContentLoaded = function onDOMContentLoaded() {


            //CODE TO TEST IN SESSION
            var copyForm = document.createElement('FORM');
            copyForm.id = 'loginFormCopy';
            copyForm.innerHTML = `
                <div class="govuk-form-group"><label class="govuk-label" for="emailCopy">Copy Email address</label><span id="emailCopyError" class="govuk-error-message" style="display:none"></span><input type="text" class="govuk-input govuk-!-width-one-half" id="emailCopy" name="emailCopy"></div><div class="govuk-form-group"><label class="govuk-label" for="passwordCopy">Copy Password</label><span id="passwordCopyError" class="govuk-error-message" style="display: none;"></span><input type="password" class="govuk-input govuk-!-width-one-half" id="passwordCopy" name="passwordCopy"></div><button class="button" id="preSubmit" type="submit">Sign in</button>
            `;
            var apiNode = document.getElementById('api');
            apiNode.parentNode.insertBefore(copyForm, apiNode.nextSibling);

            var errorContainer = document.createElement('DIV');
            errorContainer.id = 'pageLevelErrorContainerCopy';
            errorContainer.style.display = 'none';
            errorContainer.innerHTML = `
                <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary"><h2 class="govuk-error-summary__title" id="error-summary-title">COPY - There is a problem</h2><div class="govuk-error-summary__body"><ul id="errorSummaryItems" class="govuk-list govuk-error-summary__list"></ul></div></div>
            `;

            apiNode.parentNode.insertBefore(errorContainer, apiNode.nextSibling);

            apiNode.style.display = 'none';
            //END CODE TO TEST IN SESSION


            //retrieve all elements we will need
            self.form = document.getElementById('localAccountForm');
            self.formCopy = document.getElementById('loginFormCopy');
            self.emailElement = document.getElementById('email');
            self.emailCopyElement = document.getElementById('emailCopy');
            self.passwordElement = document.getElementById('password');
            self.passwordCopyElement = document.getElementById('passwordCopy');
            self.forgotPasswordCopyElement = document.getElementById('forgotPasswordCopy');
            self.submitButton = document.getElementById('next');

            //errors
            self.emailCopyError = document.getElementById('emailCopyError');
            self.passwordCopyError = document.getElementById('passwordCopyError');
            //store them in an array to clear them easily later on
            self.itemLevelErrors = [self.emailCopyError, self.passwordCopyError];
            //TODO change to point to actual page error container after removing code to test in session
            self.pageLevelErrorContainer = document.getElementById('pageLevelErrorContainerCopy');
            self.errorSummaryItems = document.getElementById('errorSummaryItems');

            self.formCopy.addEventListener('submit', self.onBeforeSubmit);

            // manipulate the DOM to get forgot password link and update its href
            if(self.forgotPasswordCopyElement){
                //modify href
                var queryParams = (new URL(document.location)).searchParams;
                var redirectURI = queryParams.get("redirect_uri");
                self.forgotPasswordCopyElement.href = getB2CLink(ACTIONS.RESET_PASSWORD);
                self.forgotPasswordCopyElement.href = self.forgotPasswordCopyElement.href.replace(/__redirectURI__/g, redirectURI);
            }

            //observer for page level errors
            var obs = new MutationObserver(this.pageLevelErrorCallback);
            var observerConfig = { attributes: true, childList: true, subtree: true };
            obs.observe(apiNode, observerConfig);
            
        };
        
        this.init = function init() {
            document.title = 'Sign in to your account | National Careers Service';

            if (document.readyState === "complete"
                || document.readyState === "loaded"
                || document.readyState === "interactive") {

                // document has at least been parsed, go and tweak the template received by B2C
                self.onDOMContentLoaded();
            }
            else {
                document.addEventListener("DOMContentLoaded", self.onDOMContentLoaded);
            }

        }

    }

    new Controller().init();

})();