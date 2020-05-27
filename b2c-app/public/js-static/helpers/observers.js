/**
 * Callback that will look for style changes to show/hide item level errors
 * and add or remove the govuk-form-group--error class to the parent 
 * -- We find this behaviour to show/hide errors in login page
 */
function itemLevelErrorDisplayCallback(mutationsList, observer) {
    for (var mutation of mutationsList) {
        if (mutation.type === 'attributes' &&
            mutation.attributeName === 'style' &&
            mutation.target.classList.contains('error') &&
            mutation.target.classList.contains('itemLevel')
        ) {
            if (mutation.target.style.display === 'none') {
                //add class to highlight error
                mutation.target.parentElement.classList.remove('govuk-form-group--error');
            }
            else {
                //remove class to highlight error
                mutation.target.parentElement.classList.add('govuk-form-group--error');
            }
        }
    }
};

/**
 * Callback that will look for class changes to show/hide item level errors
 * and add or remove the govuk-form-group--error class to the parent 
 * -- We find this behaviour to show/hide errors in signup page
*/
function itemLevelErrorClassCallback(mutationsList, observer) {
    for (var mutation of mutationsList) {
        if (mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            mutation.target.classList.contains('error') &&
            mutation.target.classList.contains('itemLevel')
        ) {
            if (mutation.target.classList.contains('show')) {
                //add class to highlight error
                mutation.target.parentElement.classList.add('govuk-form-group--error');
            }
            else {
                //remove class to highlight error
                mutation.target.parentElement.classList.remove('govuk-form-group--error');
            }
        }

        //add/remove highlight from item level errors being added/removed
        if (mutation.type === 'childList' &&
            mutation.target.classList.contains('error') &&
            mutation.target.classList.contains('itemLevel') &&
            mutation.target.classList.contains('show')
        ) {
            if (mutation.removedNodes.length) {
                //remove class to highlight error
                mutation.target.parentElement.classList.remove('govuk-form-group--error');
            }
            else if (mutation.addedNodes.length) {
                //add class to highlight error
                mutation.target.parentElement.classList.add('govuk-form-group--error');
            }
        }
    }
};

/**
 * Callback that will look for class changes to show/hide page level errors
 */
function pageLevelErrorCallback(mutationsList, observer) {
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
        self.refreshPageLevelErrors();
    }
};

function refreshPageLevelErrors() {
    // manipulate the DOM so that we can find all page level errors and put them in the same place,
    // potentially outside the B2C container
    this._govUkPageErrorElement = document.createElement('div');
    this._govUkPageErrorElement.innerHTML = `
        <div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">
                <h2 class="govuk-error-summary__title" id="error-summary-title">
                    There is a problem
                </h2>
                <div class="govuk-error-summary__body">
                    <ul id="errorSummaryItems" class="govuk-list govuk-error-summary__list">
                    
                    </ul>
                </div>
        </div>
        `;

    //get all page level error elements
    this._pageErrors = document.getElementsByClassName('error pageLevel');

    // find out how many of these errors are visible
    var numVisibleItems = Array.from(this._pageErrors).filter(function (item) {
        return item.offsetParent !== null;
    }).length;

    // only add the error summary if there is at least one error visible
    if (numVisibleItems > 0) {

        this._pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');

        if (this._pageLevelErrorContainer) {
            this._pageLevelErrorContainer.appendChild(this._govUkPageErrorElement);
            //get the error summary items container
            this._pageLevelErrorItemsContainer = document.getElementById("errorSummaryItems");
            Array.from(this._pageErrors).forEach((errorItem) => {
                //and add each page level error as list items
                var listItem = document.createElement("LI");
                var paragraph = document.createElement("P");
                paragraph.appendChild(errorItem);
                listItem.appendChild(paragraph);
                this._pageLevelErrorItemsContainer.appendChild(listItem);
            });
        }
    }
};

function setB2CObservers(){
    var targetNode = document.getElementById('api');
    var observers = [
        new MutationObserver(itemLevelErrorDisplayCallback),
        new MutationObserver(itemLevelErrorClassCallback),
        new MutationObserver(pageLevelErrorCallback)
    ];
    var observerConfig = { attributes: true, childList: true, subtree: true };

    observers.forEach(function (observer) {
        // Start observing the target node for configured mutations
        observer.observe(targetNode, observerConfig);
    });
}