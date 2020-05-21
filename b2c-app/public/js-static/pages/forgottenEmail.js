(function () {

    var Controller = function Controller() {

        this.onDOMContentLoaded = function onDOMContentLoaded() {

            var self = this;

            this.onBeforeSubmit = function (event) {
                event.preventDefault();
                event.stopPropagation();
                //flag used to determine if submit should go ahead or not
                var error = false;

                //get values from the form
                var day = self.yearElement.value;
                var month = self.monthElement.value - 1;
                var year = self.dayElement.value;

                try {
                    //validate the date input
                    var inputDate = new Date(year, month, day);
                    if (day > 31 ||
                        month > 11 ||
                        year > new Date().getFullYear() ||
                        !inputDate instanceof Date ||
                        isNaN(inputDate) ||
                        inputDate.getMonth() !== month //this one would mean user entered 29th of a month in a non leap year
                    ) {
                        //failed validation, show an error and prevent submit
                        self.dobError.innerHTML = 'Enter a valid date of birth';
                        self.dobError.classList.add('show');
                        e.preventDefault();
                        error = true;
                    }
                    else {
                        self.dobError.innerHTML = '';
                        self.dobError.classList.remove('show');
                    }
                }
                finally {
                    //if no errors return true so that submit actually happens
                    return !error;
                }
            };

            //add validation on submit so that we can check dates are valid
            // document.getElementById('attributeVerification').addEventListener('submit', this.onBeforeSubmit);
            document.getElementById('attributeVerification').addEventListener('submit', function(e){
                e.preventDefault();
                console.log('submit');
                return false;
            })

            document.getElementById('continue').addEventListener('click', function(e){
                e.preventDefault();
                console.log('click');
                return false;
            })

            // manipulate the DOM to add extra class to input fields for day, month and year
            // and also update its href
            this.dayElement = document.getElementById('day');
            this.monthElement = document.getElementById('month');
            this.yearElement = document.getElementById('year');

            //set input type doesn't work so adding some events to allow user to enter only numbers
            this.numericInputHandler = function(evt){
                var key = window.event ? event.keyCode : event.which;
                if ( key < 48 || key > 57 ) {
                    event.preventDefault();
                }
            };
            this.dayElement.addEventListener('keypress', this.numericInputHandler);
            this.monthElement.addEventListener('keypress', this.numericInputHandler);
            this.yearElement.addEventListener('keypress', this.numericInputHandler);

            //remove classes of textInput
            this.dayElement.classList.remove('textInput');
            this.dayElement.className = 'govuk-input govuk-date-input__input govuk-input--width-2';
            this.monthElement.classList.remove('textInput');
            this.monthElement.className = 'govuk-input govuk-date-input__input govuk-input--width-2';
            this.yearElement.classList.remove('textInput');
            this.yearElement.className = 'govuk-input govuk-date-input__input govuk-input--width-4';

            if (this.dayElement && this.monthElement && this.yearElement) {

                this.dateAttrEntry = document.createElement('div');
                this.dateAttrEntry.className = 'attrEntry';

                this.dateContainer = document.createElement('div');
                this.dateContainer.className = 'govuk-date-input';

                this.dayContainer = document.createElement('div');
                this.dayContainer.className = 'govuk-date-input__item';
                this.monthContainer = document.createElement('div');
                this.monthContainer.className = 'govuk-date-input__item';
                this.yearContainer = document.createElement('div');
                this.yearContainer.className = 'govuk-date-input__item';

                this.dayContainer.appendChild(this.dayElement.parentNode);
                this.monthContainer.appendChild(this.monthElement.parentNode);
                this.yearContainer.appendChild(this.yearElement.parentNode);

                this.dateContainer.appendChild(this.dayContainer);
                this.dateContainer.appendChild(this.monthContainer);
                this.dateContainer.appendChild(this.yearContainer);

                this.dateAttrEntry.appendChild(this.dateContainer);

                this.postCodeElement = document.getElementById('postCode');
                this.postCodeElement.parentNode.parentNode.parentNode.insertBefore(this.dateAttrEntry, this.postCodeElement.parentNode.parentNode);

                //remove item level error items from day, month and year
                var errorItems = this.dateContainer.getElementsByClassName('error itemLevel');
                Array.from(errorItems).forEach(function (item) {
                    item.remove();
                });

                //add date error placeholder
                this.dobError = document.createElement('div');
                this.dobError.className = 'error itemLevel';
                this.dateContainer.parentNode.insertBefore(this.dobError, this.dateContainer);

                //add date of birth hint
                this.dobHint = document.createElement('span');
                this.dobHint.className = 'govuk-hint';
                this.dobHint.innerHTML = `For example, 31 3 1980`;
                this.dateContainer.parentNode.insertBefore(this.dobHint, this.dobError);

                //add date of birth label
                this.newDobLabel = document.createElement('label');
                this.newDobLabel.innerHTML = `Date of birth`;
                this.dobHint.parentNode.insertBefore(this.newDobLabel, this.dobHint);
                //remove existing dob label
                this.dobLabel = document.getElementById('dobLabel');
                this.dobLabel.parentNode.parentNode.remove();


                //add postcode hint
                this.postcodeHint = document.createElement('span');
                this.postcodeHint.className = 'govuk-hint';
                this.postcodeHint.innerHTML = `For example, SW1A 1AA`;

                this.postcodeElement = document.getElementById('postCode');
                if (this.postcodeElement) {
                    this.postcodeElement.parentNode.insertBefore(this.postcodeHint, this.postcodeElement);
                }



                //get all list items and remove the ones left empty
                this.listItems = document.getElementsByTagName('li');
                Array.from(this.listItems).forEach(function (item) {
                    if (!item.hasChildNodes()) {
                        item.remove();
                    }
                });

            }

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