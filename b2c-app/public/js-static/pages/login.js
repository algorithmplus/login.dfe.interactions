(function () {

    var Controller = function Controller() {
        
        this.onDOMContentLoaded = function onDOMContentLoaded() {

            // manipulate the DOM to move forgot password link outside its parent
            // and also update its href
            this.forgotPassword = document.getElementById('forgotPassword');
            if(this.forgotPassword){
                //modify href
                var queryParams = (new URL(document.location)).searchParams;
                var redirectURI = queryParams.get("redirect_uri");
                this.forgotPassword.href = getB2CLink('reset-password');
                this.forgotPassword.href = this.forgotPassword.href.replace(/__redirectURI__/g, redirectURI);  
                
                //now move the element to the desired location
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