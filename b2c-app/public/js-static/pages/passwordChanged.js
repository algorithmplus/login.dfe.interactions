(function () {

    var Controller = function Controller() {

        this.onDOMContentLoaded = function onDOMContentLoaded() {

            // hide the B2C element as we don't really need anything from it
            this.b2cElement = document.getElementById('api');
            if(this.b2cElement){
                this.b2cElement.style.display = 'none';
            }
            
        };        
        
        this.init = function init() {
            document.title = 'We\'ve changed your password | National Careers Service'; 
            
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