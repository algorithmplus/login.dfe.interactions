(function () {

    var Controller = function Controller() {

        var self = this;

        //declare all the items I will be manipulating across this controller
        this.form = null;
        this.givenNameElement = null;
        this.lastNameElement = null;
        this.postCodeElement = null;
        this.dayElement = null;
        this.monthElement = null;
        this.yearElement = null;
        this.preSubmitButton = null;
        this.continueButton = null;
        this.givenNameError = null;
        this.givenNamePageError = null; //error at page level
        this.lastNameError = null;
        this.lastNamePageError = null;
        this.postCodeError = null;
        this.postCodePageError = null;
        this.dobError = null; //error placeholder for custom DOB entry
        this.dobPageError = null;

        //function to show item level errors
        this.showItemAndPageLevelError = function (message, itemLevelElem, pageLevelElem) {
            if(itemLevelElem){
                itemLevelElem.innerHTML = message;
                itemLevelElem.classList.add('show');
            }
            if(pageLevelElem){
                pageLevelElem.firstChild.innerHTML = message;
                pageLevelElem.style.display = 'block';
            }            
        };

        //function to hide item level errors
        this.hideItemAndPageLevelError = function (itemLevelElem, pageLevelElem) {
            if(itemLevelElem){
                itemLevelElem.innerHTML = '';
                itemLevelElem.classList.remove('show');
            }
            if(pageLevelElem){
                pageLevelElem.firstChild.innerHTML = '';
                pageLevelElem.style.display = 'none';
            } 
        };

        //function to handle our own validation before calling the actual submit (in B2C continue button)
        this.onBeforeSubmit = function (event) {

            //flag used to determine if submit should go ahead or not
            var valid = true;

            //validate date of birth

            //validate date fields not empty
            if ( self.dayElement.value === '' && self.monthElement.value === '' && self.yearElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Enter date of birth', self.dobError, self.dobPageError);
            }
            else {
                //get values from the form
                var day = self.dayElement.value;
                var month = self.monthElement.value - 1;
                var year = self.yearElement.value;

                //validate the date input
                var inputDate = new Date(year, month, day);

                if (isNaN(inputDate.getTime()) ||
                    inputDate.getMonth() !== month //this one would mean user entered 29th of a month in a non leap year
                ) {
                    //failed validation, show an error and prevent submit
                    valid = false;
                    self.showItemAndPageLevelError('Enter a valid date of birth', self.dobError, self.dobPageError);
                }
                else {
                    self.hideItemAndPageLevelError(self.dobError, self.dobPageError);
                }
            }

            //validate given name
            if (self.givenNameElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Enter your first name', self.givenNameError, self.givenNamePageError);
            }
            else {
                self.hideItemAndPageLevelError(self.givenNameError, self.givenNamePageError);
            }

            //validate lastName
            if (self.lastNameElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Enter your last name', self.lastNameError, self.lastNamePageError);
            }
            else {
                self.hideItemAndPageLevelError(self.lastNameError, self.lastNamePageError);
            }

            //validate postCode
            if (self.postCodeElement.value === '') {
                valid = false;
                self.showItemAndPageLevelError('Enter your postcode', self.postCodeError, self.postCodePageError);
            }
            else {
                self.hideItemAndPageLevelError(self.lastNameError, self.postCodePageError);
            }

            //if no errors, submit actually happens
            if (valid) {
                self.continueButton.click(event);
            }
        };

        this.numericInputHandler = function (evt) {
            var key = window.event ? event.keyCode : event.which;
            if (key < 48 || key > 57) {
                event.preventDefault();
            }
        };

        //gets all list items and remove the ones left empty
        this.removeEmptyListItems = function () {
            var listItems = document.getElementsByTagName('li');
            Array.from(listItems).forEach(function (item) {
                if (!item.hasChildNodes()) {
                    item.remove();
                }
            });
        };

        this.getErrorPlaceholder = function (elem) {
            if (elem && elem.parentNode) {
                var errorElements = elem.parentNode.getElementsByClassName('error itemLevel');
                if(errorElements.length){
                    //return first element
                    return errorElements[0];
                }
            }
        };

        this.createPageLevelErrorPlaceholder = function (link) {
            var elem = document.createElement('div');
            elem.className = 'error pageLevel';
            elem.style.display = 'none';
            elem.innerHTML = `<a href=#${link}></a>`
            return elem;
        }

        this.onDOMContentLoaded = function onDOMContentLoaded() {

            //get all the elements we will be manipulating at some point
            self.form = document.getElementById('attributeVerification');
            self.givenNameElement = document.getElementById('givenName');
            self.lastNameElement = document.getElementById('surname');
            self.postCodeElement = document.getElementById('postCode');
            //get item level error placeholders
            self.givenNameError = self.getErrorPlaceholder(self.givenNameElement);
            self.lastNameError = self.getErrorPlaceholder(self.lastNameElement);
            self.postCodeError = self.getErrorPlaceholder(self.postCodeElement);

            //date
            self.dayElement = document.getElementById('day');
            self.monthElement = document.getElementById('month');
            self.yearElement = document.getElementById('year');
            //pre-submit button to do our own validation and prevent submit (already listened to so can't stop it there)
            self.preSubmitButton = document.createElement('button');
            self.preSubmitButton.className = 'govuk-button';
            self.preSubmitButton.innerHTML = 'Find email address';
            //continue button coming from B2C
            self.continueButton = document.getElementById('continue');
            self.continueButton.parentNode.insertBefore(self.preSubmitButton, self.continueButton);

            //add validation on submit so that we can check dates are valid
            self.form.addEventListener('submit', self.onBeforeSubmit);

            //hide continue button as we will be using our own pre-submit button
            self.continueButton.style.display = 'none';


            // manipulate the DOM to show date input fields with the right format
            if (self.dayElement && self.monthElement && self.yearElement && self.postCodeElement) {

                //set input type doesn't work (value  not sent on submit) so adding some events to force user to enter only numbers
                self.dayElement.addEventListener('keypress', self.numericInputHandler);
                self.monthElement.addEventListener('keypress', self.numericInputHandler);
                self.yearElement.addEventListener('keypress', self.numericInputHandler);

                //remove classes of textInput and add govuk classes
                self.dayElement.classList.remove('textInput');
                self.dayElement.className = 'govuk-input govuk-date-input__input govuk-input--width-2';
                self.monthElement.classList.remove('textInput');
                self.monthElement.className = 'govuk-input govuk-date-input__input govuk-input--width-2';
                self.yearElement.classList.remove('textInput');
                self.yearElement.className = 'govuk-input govuk-date-input__input govuk-input--width-4';

                //create structure to accomomodate new elements
                var dateAttrEntry = document.createElement('div');
                dateAttrEntry.className = 'attrEntry';

                var dateContainer = document.createElement('div');
                dateContainer.className = 'govuk-date-input';

                var dayContainer = document.createElement('div');
                dayContainer.className = 'govuk-date-input__item';
                var monthContainer = document.createElement('div');
                monthContainer.className = 'govuk-date-input__item';
                var yearContainer = document.createElement('div');
                yearContainer.className = 'govuk-date-input__item';

                //add elements to new structure
                dayContainer.appendChild(self.dayElement.parentNode);
                monthContainer.appendChild(self.monthElement.parentNode);
                yearContainer.appendChild(self.yearElement.parentNode);

                dateContainer.appendChild(dayContainer);
                dateContainer.appendChild(monthContainer);
                dateContainer.appendChild(yearContainer);

                dateAttrEntry.appendChild(dateContainer);

                //insert it before the postCode element
                self.postCodeElement.parentNode.parentNode.parentNode.insertBefore(dateAttrEntry, self.postCodeElement.parentNode.parentNode);

                //remove item level error items from day, month and year
                var errorItems = dateContainer.getElementsByClassName('error itemLevel');
                Array.from(errorItems).forEach(function (item) {
                    item.remove();
                });

                //add date error placeholder
                this.dobError = document.createElement('div');
                this.dobError.className = 'error itemLevel';
                dateContainer.parentNode.insertBefore(this.dobError, dateContainer);

                //add date of birth hint
                var dobHint = document.createElement('span');
                dobHint.className = 'govuk-hint';
                dobHint.innerHTML = `For example, 31 3 1980`;
                dateContainer.parentNode.insertBefore(dobHint, this.dobError);

                //add date of birth label
                var newDobLabel = document.createElement('label');
                newDobLabel.id = 'dobLabel'
                newDobLabel.innerHTML = `Date of birth`;
                dobHint.parentNode.insertBefore(newDobLabel, dobHint);
                //remove existing dob label
                dobLabel = document.getElementById('dobLabel');
                dobLabel.parentNode.parentNode.remove();

                //add postCode hint
                var postCodeHint = document.createElement('span');
                postCodeHint.className = 'govuk-hint';
                postCodeHint.innerHTML = `For example, SW1A 1AA`;
                self.postCodeElement.parentNode.insertBefore(postCodeHint, self.postCodeElement);
            }

            //create page level error placeholders
            self.givenNamePageError = self.createPageLevelErrorPlaceholder(self.givenNameElement.id);
            self.lastNamePageError = self.createPageLevelErrorPlaceholder(self.lastNameElement.id);
            self.postCodePageError = self.createPageLevelErrorPlaceholder(self.postCodeElement.id);
            self.dobPageError = self.createPageLevelErrorPlaceholder(newDobLabel.id);

            //add them as children of the current form
            self.form.appendChild(self.givenNamePageError);
            self.form.appendChild(self.lastNamePageError);
            self.form.appendChild(self.dobPageError);
            self.form.appendChild(self.postCodePageError);

            //remove list items that could be left empty after all dom manipulation
            self.removeEmptyListItems();

        };

        this.init = function init() {
            document.title = 'Find your email address | National Careers Service';

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