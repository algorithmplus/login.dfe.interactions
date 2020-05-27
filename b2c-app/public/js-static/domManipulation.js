(function () {
    var Controller = function Controller() {

        this.onDOMContentLoaded = function onDOMContentLoaded() {

            //Replace placeholder for redirect URI and B2C tenant in all the links
            replaceUrlPlaceholders();

        };

        this.init = function init() {
            if (document.readyState === "complete"
                || document.readyState === "loaded"
                || document.readyState === "interactive") {

                // document has at least been parsed, go and tweak the template received by B2C
                this.onDOMContentLoaded();
            }
            else {
                document.addEventListener("DOMContentLoaded", this.onDOMContentLoaded);
            }
        };
    }

    new Controller().init();

})();