(function () {

    var Controller = function Controller() {
        
        this.onDOMContentLoaded = function onDOMContentLoaded() {

            
            
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