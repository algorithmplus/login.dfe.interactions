(function () {

    var Controller = function Controller() {

        var self = this;

        //B2C form items
        this.form = null;
        this.submitButton = null;
        //Form copy items
        this.formCopy = null;

        //function to handle our own validation before calling the actual submit (in B2C continue button)
        this.onBeforeSubmit = function (event) {

            event.preventDefault();

            //clear errors
            clearPageLevelErrors();

            //run password validation. If no errors, submit actually happens
            if (isValidPasswordInput()) {
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

            //retrieve all elements we will need
            self.form = document.getElementById('attributeVerification');
            self.formCopy = document.getElementById('resetPasswordFormCopy');
            self.submitButton = document.getElementById('continue');

            //listen to submit event to run our validation
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