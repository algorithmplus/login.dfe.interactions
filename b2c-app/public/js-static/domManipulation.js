function onErrorsUpdate() {
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
    var numVisibleItems = Array.from(this._pageErrors).filter(function(item){
        return item.offsetParent !== null;
    }).length;

    // only add the error summary if there is at least one error visible
    if(numVisibleItems > 0){

        this._pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');

        if(this._pageLevelErrorContainer){
            this._pageLevelErrorContainer.appendChild(this._govUkPageErrorElement);
            //get the error summary items container
            this._pageLevelErrorItemsContainer = document.getElementById("errorSummaryItems");
            Array.from(this._pageErrors).forEach( (errorItem) => {   
                //and add each page level error as list items
                var listItem = document.createElement("LI");
                var paragraph = document.createElement("P");
                paragraph.appendChild(errorItem);
                listItem.appendChild(paragraph);
                this._pageLevelErrorItemsContainer.appendChild(listItem);
            });
        }
    }
}

function onLoad() {
    console.log('DOM loaded');
    console.log(document.getElementById('api'));
    console.log(document.getElementsByClassName('error pageLevel'));


    //Replace placeholder for redirect URI in all the links
    var queryParams = (new URL(document.location)).searchParams;
    var redirectURI = queryParams.get("redirect_uri");
    
    if(redirectURI){
        var els = document.querySelectorAll("a[href^='authorize?']");
        els.forEach(function(item){
            item.href = item.href.replace(/__redirectURI__/g, redirectURI);
        });
    }    

    
    // manipulate the DOM so that we can include the password help item
    this._passWordHelp = document.createElement('div');
    /* eslint-disable */
    this._passWordHelp.innerHTML = `
        <details class="govuk-details govuk-!-margin-top-3" data-module="govuk-details">
            <summary class="govuk-details__summary">
                    <span class="govuk-details__summary-text">
                    Help choosing a valid password
                    </span>
            </summary>
            <div class="govuk-details__text">
                    <p>Your password must be between 8 and 16 characters and contain 3 out of 4 of the following:</p>
                    <ul class="govuk-list govuk-list--bulllet">
                        <li>lowercase characters</li>
                        <li>uppercase characters</li>
                        <li>digits (0-9)</li>
                        <li>one or more of the following symbols: @ # $ % ^ & * - _ + = [ ] { } | \ : ' , ? / \` ~ " ( ) ; . </li>
                    </ul>
            </div>
        </details>
      `;
      /* eslint-enable */

    //Add password help
    this._passwordElement = document.getElementById('newPassword');
    if(this._passwordElement){
        this._passwordElement.parentNode.insertBefore(this._passWordHelp, this._passwordElement.nextSibling);
    }
}

document.addEventListener("DOMContentLoaded", onLoad, false);

//Observe changes into the API node coming from B2C
var targetNode = document.getElementById('api');

//options for the observer
var config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);