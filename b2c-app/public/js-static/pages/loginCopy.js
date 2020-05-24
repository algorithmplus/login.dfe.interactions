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

        
        this.onDOMContentLoaded = function onDOMContentLoaded() {

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
            self.pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');
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