class B2CObserver {

    //function to refresh the page level errors in our govuk container with the right format
    newRefreshPageLevelErrors() {

        //get all page level error elements
        let pageErrors = document.getElementsByClassName('error pageLevel');

        // find out how many of these errors are visible
        let numVisibleItems = Array.from(pageErrors).filter(function (item) {
            return item.style.display !== 'none';
        }).length;

        // only add the error summary if there is at least one error visible
        if (numVisibleItems > 0) {

            let errorSummaryItems = document.getElementById('errorSummaryItems');;
            let pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');

            //add all page level errors to the list
            Array.from(pageErrors).forEach((errorItem) => {
                //and add each page level error as list items
                let pageError = document.createElement('LI');
                pageError.appendChild(errorItem);
                errorSummaryItems.appendChild(pageError);
                pageLevelErrorContainer.style.display = 'block';
            });
        }
    }

    /**
    * Callback that will look for class changes to show/hide page level errors
    */
    newPageLevelErrorCallback(mutationsList, observer) {
        //flag to see if we have to refresh page level errors
        let refreshErrorsRequired = false;

        //loop through mutated objects to run crazy logic and update the UI accordingly
        for (let mutation of mutationsList) {

            //Determine if we will need to refresh the page level errors after the loop
            if (!refreshErrorsRequired &&
                mutation.target.classList.contains('error') &&
                mutation.target.classList.contains('pageLevel')
            ) {
                refreshErrorsRequired = true;
            }
        }

        //refresh the page level errors if there was at least one included
        if (refreshErrorsRequired) {
            this.newRefreshPageLevelErrors();
        }
    }

    //function to set observer for page level errors
    setB2CErrorObservers() {
        const targetNode = document.getElementById('api');
        if(targetNode){
            const obs = new MutationObserver(this.newPageLevelErrorCallback);
            const observerConfig = { attributes: true, childList: true, subtree: true };
            obs.observe(targetNode, observerConfig);            
        }
    }

}

export default B2CObserver;