//function to refresh the page level errors in our govuk container with the right format
function newRefreshPageLevelErrors() {

    //get all page level error elements
    this._pageErrors = document.getElementsByClassName('error pageLevel');

    // find out how many of these errors are visible
    var numVisibleItems = Array.from(this._pageErrors).filter(function (item) {
        return item.style.display !== 'none';
    }).length;

    // only add the error summary if there is at least one error visible
    if (numVisibleItems > 0) {

        //add all page level errors to the list
        Array.from(this._pageErrors).forEach((errorItem) => {
            //and add each page level error as list items
            var pageError = document.createElement('LI');
            pageError.appendChild(errorItem);
            self.errorSummaryItems.appendChild(pageError);
            self.pageLevelErrorContainer.style.display = 'block';
        });
    }
};

/**
 * Callback that will look for class changes to show/hide page level errors
 */
function newPageLevelErrorCallback(mutationsList, observer) {
    //flag to see if we have to refresh page level errors
    var refreshErrorsRequired = false;

    //loop through mutated objects to run crazy logic and update the UI accordingly
    for (var mutation of mutationsList) {

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
        newRefreshPageLevelErrors();
    }
};

//function to set observer for page level errors
function setB2CErrorObservers() {
    var targetNode = document.getElementById('api');
    var obs = new MutationObserver(newPageLevelErrorCallback);
    var observerConfig = { attributes: true, childList: true, subtree: true };
    obs.observe(targetNode, observerConfig);
}