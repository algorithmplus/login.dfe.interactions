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

        //function to clear all the page level errors
        this.clearPageLevelErrors = function(){
            self.pageLevelErrorContainer.style.display = 'none';
            self.errorSummaryItems.innerHTML = '';
        };

        //function to clear all the item level errors
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

            if (self.newPasswordCopyElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Enter your password', self.newPasswordCopyError, self.newPasswordCopyElement.id);
            }
            else if(self.newPasswordCopyElement.value.length < 8){
                valid = false;
                self.showItemAndPageLevelError('Enter at least 8 characters', self.newPasswordCopyError, self.newPasswordCopyElement.id);
            }
            else if (self.reenterPasswordCopyElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Re-enter your password', self.reenterPasswordCopyError, self.reenterPasswordCopyElement.id);
            }
            else if (self.newPasswordCopyElement.value !== '' &&
                self.reenterPasswordCopyElement.value !== '' &&
                self.newPasswordCopyElement.value !== self.reenterPasswordCopyElement.value) {
                
                valid = false;
                self.showItemAndPageLevelError('Your passwords do not match', self.reenterPasswordCopyError, self.reenterPasswordCopyElement.id);
            }

            //if no errors, submit actually happens
            if (valid) {
                self.newPasswordElement.value = self.newPasswordCopyElement.value;
                self.reenterPasswordElement.value = self.reenterPasswordCopyElement.value;
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

        //function to refresh the page level errors in our govuk container with the right format
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

            //hide B2C api element
            var apiNode = document.getElementById('api');
            apiNode.style.display = 'none';

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

            //retrieve elements needed for page level errors
            self.pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');
            self.errorSummaryItems = document.getElementById('errorSummaryItems');

            self.formCopy.addEventListener('submit', self.onBeforeSubmit);

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