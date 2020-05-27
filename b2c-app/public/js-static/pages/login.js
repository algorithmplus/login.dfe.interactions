(function () {

    var Controller = function Controller() {

        this.onDOMContentLoaded = function onDOMContentLoaded() {

            // manipulate the DOM to move forgot password link outside its parent
            // and also update its href
            this.forgotPassword = document.getElementById('forgotPassword');
            if(this.forgotPassword){
                //modify href
                this.forgotPassword.href = getB2CLink(ACTIONS.RESET_PASSWORD);
                replaceUrlPlaceholders(); 
                
                //now move the element to the desired location
                //get its actual wrapper that contains the class
                this.forgotPasswordWrapper = this.forgotPassword.parentNode;
                if (this.forgotPasswordWrapper){
                    this.forgotPasswordContainer = this.forgotPasswordWrapper.parentNode;
                    //move the password element with its class, put it after its current container
                    this.forgotPasswordContainer.parentNode.insertBefore(this.forgotPasswordWrapper, this.forgotPasswordContainer.nextSibling);
                }
            }

            //set the common observers for B2C changes
            setB2CObservers();
            
        };
        
        this.init = function init() {
            document.title = 'Sign in to your account | National Careers Service';

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