
function validateTsAndCsInput(passwordElem, passwordError, reenteredPasswordElem, reenteredPasswordError) {
    
    var isValid = true;

    //input fields from B2C
    var tsAndCsElement = document.getElementById('termsAndConditions');
    //input fields from our own version of Ts & Cs input
    var tsAndCsCopyElement = document.getElementById('termsAndConditionsCopy');
    //error placeholders in our own Ts & Cs input
    var tsAndCsCopyError = document.getElementById('termsAndConditionsCopyError');

    //clear item level errors first
    clearItemLevelErrors([tsAndCsCopyError]);

    if (!tsAndCsCopyElement.checked) {
        isValid = false;
        showItemAndPageLevelError(
            'You must accept our Terms and Conditions',
            tsAndCsCopyError,
            tsAndCsCopyElement.id
        );
    }

    //set values in b2c form if all valid
    if (isValid) {
        tsAndCsElement.checked = tsAndCsCopyElement.checked;
    }

    return isValid;
}