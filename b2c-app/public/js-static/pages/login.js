(function () {

    var Controller = function Controller() {
        
        this.onDOMContentLoaded = function onDOMContentLoaded() {

            //manipulate the DOM to move forgot password link outside its parent
            if(this.forgotPassword){
                //get its actual wrapper that contains the class
                this.forgotPasswordWrapper = this.forgotPassword.parentNode;
                if (this.forgotPasswordWrapper){
                    this.forgotPasswordContainer = this.forgotPasswordWrapper.parentNode;
                    //move the password element with its class, put it after its current container
                    this.forgotPasswordContainer.parentNode.insertBefore(this.forgotPasswordWrapper, this.forgotPasswordContainer.nextSibling);
                }
            }

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