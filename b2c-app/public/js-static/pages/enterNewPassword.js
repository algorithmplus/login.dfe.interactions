(function () {

    var Controller = function Controller() {

        var self = this;

        //B2C form items
        this.form = null;
        this.newPasswordElement = null;
        this.reenterPasswordElement = null;
        this.submitButton = null;
        //Form copy items
        this.formCopy = null;
        this.newPasswordCopyElement = null;
        this.reenterPasswordElement = null;

        //Item level errors
        this.newPasswordCopyError = null;
        this.reenterPasswordCopyError = null;
        this.itemLevelErrors = null; //array used to clear errors easily


        //function to handle our own validation before calling the actual submit (in B2C continue button)
        this.onBeforeSubmit = function (event) {

            event.preventDefault();

            //flag used to determine if submit should go ahead or not
            var valid = true;

            //clear errors
            clearPageLevelErrors();
            clearItemLevelErrors(self.itemLevelErrors);

            var password = self.newPasswordCopyElement.value;
            var reenteredPassword = self.reenterPasswordCopyElement.value;

            if (password === '') {
                valid = false;
                showItemAndPageLevelError(
                    'Enter your password',
                    self.newPasswordCopyError,
                    self.newPasswordCopyElement.id
                    );
            }
            else if(password.length < 8 || password.length > 16){
                valid = false;
                showItemAndPageLevelError(
                    'Enter between 8 and 16 characters',
                    self.newPasswordCopyError,
                    self.newPasswordCopyElement.id
                    );
            }
            //run validation as it has been set up in B2C (default values as suggested here: https://msdn.microsoft.com/en-us/library/azure/jj943764.aspx )
            else if(!password.match(/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&*\-_+=[\]{}|\\:',?\/`~"();!]|\.(?!@)){8,16}$/)){
                valid = false;
                showItemAndPageLevelError(
                    'Invalid password',
                    self.newPasswordCopyError,
                    self.newPasswordCopyElement.id,
                    true
                    );
            }
            else if (reenteredPassword === '') {
                valid = false;
                showItemAndPageLevelError(
                    'Re-enter your password',
                    self.reenterPasswordCopyError,
                    self.reenterPasswordCopyElement.id
                    );
            }

            else if (reenteredPassword !== '' && password !== reenteredPassword) {
                valid = false;
                showItemAndPageLevelError(
                    'Your passwords do not match',
                    self.reenterPasswordCopyError,
                    self.reenterPasswordCopyElement.id
                    );
            }

            //if no errors, submit actually happens
            if (valid) {
                self.newPasswordElement.value = password;
                self.reenterPasswordElement.value = reenteredPassword;
                self.submitButton.click(event);
            }
            else{
                return false;
            }
        };


        this.onDOMContentLoaded = function onDOMContentLoaded() {

            //hide B2C api element
            var apiNode = document.getElementById('api');
            apiNode.style.display = 'none';

            //CODE TO TEST IN SESSION
            // var copyForm = document.createElement('FORM');
            // copyForm.id = 'resetPasswordFormCopy';
            // copyForm.innerHTML = `
            //     <br/><div class="govuk-form-group"><label class="govuk-label" for="newPasswordCopy">Create new password</label><span id="newPasswordCopyError" class="govuk-error-message" style="display:none"></span><input type="password" class="govuk-input govuk-!-width-one-half" id="newPasswordCopy" name="newPasswordCopy"></div><div class="govuk-form-group"><details class="govuk-details"><summary class="govuk-details__summary"><span class="govuk-details__summary-text">Help choosing a valid password</span></summary><div class="govuk-details__text"><p>Your password must:</p><ul class="govuk-list govuk-list--bullet"><li>be between 8 and 64 characters</li><li>include at least one uppercase letter and one lowercase letter</li><li>include at least one number or one symbol</li></ul></div></details></div><div class="govuk-form-group"><label class="govuk-label" for="reenterPasswordCopy">Re-type password</label><span id="reenterPasswordCopyError" class="govuk-error-message" style="display:none"></span><input type="password" class="govuk-input govuk-!-width-one-half" id="reenterPasswordCopy" name="reenterPasswordCopy"></div><button class="govuk-button" id="preSubmit" type="submit">Reset password</button>`;
            // apiNode.parentNode.insertBefore(copyForm, apiNode.nextSibling);

            // var errorContainer = document.createElement('DIV');
            // errorContainer.id = 'pageLevelErrorContainerCopy';
            // errorContainer.style.display = 'none';
            // errorContainer.innerHTML = `
            //     <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary"><h2 class="govuk-error-summary__title" id="error-summary-title">COPY - There is a problem</h2><div id="errorSummaryText" style={{ display: 'none' }}><p class="govuk-body">Your password must:</p></div><div class="govuk-error-summary__body"><ul id="errorSummaryItems" class="govuk-list govuk-error-summary__list"></ul></div></div>
            // `;

            // apiNode.parentNode.insertBefore(errorContainer, apiNode.nextSibling);

            //END CODE TO TEST IN SESSION

            //retrieve all elements we will need
            self.form = document.getElementById('attributeVerification');
            self.formCopy = document.getElementById('resetPasswordFormCopy');
            self.newPasswordElement = document.getElementById('newPassword');
            self.newPasswordCopyElement = document.getElementById('newPasswordCopy');
            self.reenterPasswordElement = document.getElementById('reenterPassword');
            self.reenterPasswordCopyElement = document.getElementById('reenterPasswordCopy');
            self.submitButton = document.getElementById('continue');

            //errors
            self.newPasswordCopyError = document.getElementById('newPasswordCopyError');;
            self.reenterPasswordCopyError = document.getElementById('reenterPasswordCopyError');;

            //store them in an array to clear them easily later on
            self.itemLevelErrors = [self.newPasswordCopyError, self.reenterPasswordCopyError];

            self.formCopy.addEventListener('submit', self.onBeforeSubmit);

            //start observing page level errors
            setB2CErrorObservers();

        };        
        
        this.init = function init() {
            document.title = 'Reset your password | National Careers Service'; 
            
            if (document.readyState === "complete"
                || document.readyState === "loaded"
                || document.readyState === "interactive") {

                // document has at least been parsed, go and tweak the template received by B2C
                this.onDOMContentLoaded();
            }
            else {
                document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded);
            }
        }

    }

    new Controller().init();

})();