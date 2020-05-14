function onPageErrorsUpdate() {
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

function onDOMContentLoaded() {
    //Replace placeholder for redirect URI in all the links
    var queryParams = (new URL(document.location)).searchParams;
    var redirectURI = queryParams.get("redirect_uri");
    
    if(redirectURI){
        var links = document.querySelectorAll("a[href^='authorize?']");
        links.forEach(function(item){
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

//modify the UI if DOM ready, otherwise listen for event to do it then
if (document.readyState === "complete" 
     || document.readyState === "loaded" 
     || document.readyState === "interactive") {
     
     // document has at least been parsed, go and tweak the template received by B2C
     onDOMContentLoaded();
}
else{
    document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
}

//Observe changes into the API node coming from B2C
var targetNode = document.getElementById('api');

//options for the observer
var config = { attributes: true, childList: true, subtree: true};

// Callback function to execute when mutations are observed
var mutationCallback = function(mutationsList, observer) {

    //flag to see if we have to refresh page level errors
    var refreshErrorsRequired = false;
    
    //loop through mutated objects to run crazy logic and update the UI accordingly
    for(var mutation of mutationsList) {

        //Determine if we will need to refresh the page level errors after the loop
        if(!refreshErrorsRequired &&
            mutation.target.classList.contains('error') &&
            mutation.target.classList.contains('pageLevel')
            ){
            refreshErrorsRequired = true;
        }

        /**
         * sign up page errors show/hide
        **/

        // highlight item level errors added
        if(mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            mutation.target.classList.contains('error') &&
            mutation.target.classList.contains('itemLevel') &&
            mutation.target.classList.contains('show')
            ){
                //add class to highlight error
                mutation.target.parentElement.classList.add('govuk-form-group--error');
        }

        //remove highlight from item level errors being removed
        if(mutation.type === 'childList' &&
            mutation.target.classList.contains('error') &&
            mutation.target.classList.contains('itemLevel') &&
            mutation.target.classList.contains('show') &&
            mutation.removedNodes.length &&
            mutation.removedNodes[0].ownerDocument.activeElement.classList.contains('invalid')
            ){
                //remove class to highlight error
                mutation.target.parentElement.classList.remove('govuk-form-group--error');
        }


        /**
         * log in page errors show/hide
        **/        
        if(mutation.type === 'attributes' &&
            mutation.attributeName === 'style' &&
            mutation.target.classList.contains('error') &&
            mutation.target.classList.contains('itemLevel')
            ){
                if(mutation.target.style.display === 'none'){
                    mutation.target.parentElement.classList.remove('govuk-form-group--error');
                }
                else{
                    mutation.target.parentElement.classList.add('govuk-form-group--error');
                }
        }
    }

    //refresh the page level errors if there was at least one included
    if(refreshErrorsRequired){
        onPageErrorsUpdate();
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(mutationCallback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);