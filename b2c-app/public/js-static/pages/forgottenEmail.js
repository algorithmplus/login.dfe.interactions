(function () {

    var Controller = function Controller() {
        
        this.onDOMContentLoaded = function onDOMContentLoaded() {

            // manipulate the DOM to add extra class to input fields for day, month and year
            // and also update its href
            this.dayElement = document.getElementById('day');
            this.monthElement = document.getElementById('month');
            this.yearElement = document.getElementById('year');

            //remove classes of textInput
            this.dayElement.classList.remove('textInput');
            this.dayElement.className = 'govuk-input govuk-date-input__input govuk-input--width-2';
            this.monthElement.classList.remove('textInput');
            this.monthElement.className = 'govuk-input govuk-date-input__input govuk-input--width-2';
            this.yearElement.classList.remove('textInput');
            this.yearElement.className = 'govuk-input govuk-date-input__input govuk-input--width-4';

            if(this.dayElement && this.monthElement && this.yearElement){

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

                this.postCodeElement = document.getElementById('postCode');
                this.postCodeElement.parentNode.parentNode.parentNode.insertBefore(this.dateContainer, this.postCodeElement.parentNode.parentNode);

                //add date of birth hint
                this.dobHint = document.createElement('span');
                this.dobHint.className = 'govuk-hint';
                this.dobHint.innerHTML = `For example, 31 3 1980`;
                this.dateContainer.parentNode.insertBefore(this.dobHint, this.dateContainer);

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
                Array.from(this.listItems).forEach(function(item){
                    if(!item.hasChildNodes()){
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