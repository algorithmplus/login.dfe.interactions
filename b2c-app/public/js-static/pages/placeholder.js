(function () {

    var Controller = function Controller() {

        this.onDOMContentLoaded = function onDOMContentLoaded() {

            //DOM manipulation happens here

            //set the common observers for B2C changes
            setB2CObservers();
            
        };        
        
        this.init = function init() {
            document.title = ' | National Careers Service'; 
            
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