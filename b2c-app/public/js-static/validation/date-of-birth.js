
function isValidDateOfBirthInput() {

    var isValid = true;

    //input fields from B2C
    var dayElement = document.getElementById('day');
    var monthElement = document.getElementById('month');
    var yearElement = document.getElementById('year');
    //input fields from our own version of dob input
    var dayCopyElement = document.getElementById('dayCopy');
    var monthCopyElement = document.getElementById('monthCopy');
    var yearCopyElement = document.getElementById('yearCopy');
    //error placeholders in our own dob input
    var dobCopyError = document.getElementById('dobCopyError');
    var dobFieldset = document.getElementById('dobFieldset');

    //clear item level errors first
    clearItemLevelErrors([dobCopyError]);


    //validate date of birth

    //validate date fields not empty
    if (dayCopyElement.value === '' && monthCopyElement.value === '' && yearCopyElement.value === '') {
        isValid = false;
        showItemAndPageLevelError(
            'Enter date of birth',
            dobCopyError,
            dobFieldset.id
            );
    }
    else {
        //get values from the form
        var day = dayCopyElement.value;
        var month = monthCopyElement.value - 1;
        var year = yearCopyElement.value;

        //validate the date input
        var inputDate = new Date(year, month, day);

        if (isNaN(inputDate.getTime()) ||
            inputDate.getMonth() !== month //this one would mean user entered 29th of a month in a non leap year
        ) {
            //failed validation, show an error and prevent submit
            isValid = false;
            self.showItemAndPageLevelError(
                'Enter a valid date of birth',
                dobCopyError,
                dobFieldset.id
                );
        }
    }

    //set values in b2c form if all valid
    if (isValid) {
        dayElement.value = dayCopyElement.value;
        monthElement.value = monthCopyElement.value;
        yearElement.value = yearCopyElement.value;
    }

    return isValid;
}