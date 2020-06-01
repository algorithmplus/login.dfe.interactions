//function to clear all the page level errors
function clearPageLevelErrors () {

    //retrieve elements needed for page level errors
    var pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');
    var errorSummaryItems = document.getElementById('errorSummaryItems');

    if(pageLevelErrorContainer && errorSummaryItems){
        pageLevelErrorContainer.style.display = 'none';
        errorSummaryItems.innerHTML = '';
    }
};

//function to find closest parent that has class govuk-form-group
function findClosestFormGroupParent (elem){
    return elem.closest('.govuk-form-group');
};

//function to clear all the item level errors
function clearItemLevelErrors (itemLevelErrors) {
    itemLevelErrors.forEach(function(itemLevelElem){
        itemLevelElem.style.display = 'none';
        var highlightedParent = findClosestFormGroupParent(itemLevelElem);
        if(highlightedParent){
            highlightedParent.classList.remove('govuk-form-group--error');
        }
    });
};


//function to show item level errors
function showItemAndPageLevelError (message, itemLevelElem, itemId, showText) {
    
    var pageLevelErrorContainer = document.getElementById('pageLevelErrorContainer');
    var errorSummaryText = document.getElementById('errorSummaryText');
    var errorSummaryItems = document.getElementById('errorSummaryItems');

    if(pageLevelErrorContainer && errorSummaryItems && itemLevelElem){
        itemLevelElem.innerHTML = `<span class="govuk-visually-hidden">Error:</span>${message}`;
        itemLevelElem.style.display = 'block';
        //find closest parent that has class govuk-form-group as we will be highlighting it
        var parentToHighlight = findClosestFormGroupParent(itemLevelElem);
        if(parentToHighlight){
            parentToHighlight.classList.add('govuk-form-group--error');
        }

        //show text if required
        if(errorSummaryText){
            showText ? errorSummaryText.style.display = 'block' : errorSummaryText.style.display = 'none';
        }

        //page level error
        var pageError = document.createElement('LI');
        pageError.innerHTML = `<a href="#${itemId}">${message}</a>`
        errorSummaryItems.appendChild(pageError);
        pageLevelErrorContainer.style.display = 'block';
    }        
};