
function isValidPasswordInput() {
    
    var isValid = true;

    //input fields from B2C
    var newPasswordElement = document.getElementById('newPassword');
    var reenterPasswordElement = document.getElementById('reenterPassword');
    //input fields from our own version of password reset input
    var newPasswordCopyElement = document.getElementById('newPasswordCopy');
    var reenterPasswordCopyElement = document.getElementById('reenterPasswordCopy');
    //error placeholders in our own password reset input
    var newPasswordCopyError = document.getElementById('newPasswordCopyError');
    var reenteredPasswordCopyError = document.getElementById('reenterPasswordCopyError');

    //clear item level errors first
    clearItemLevelErrors([newPasswordCopyError, reenteredPasswordCopyError]);

    var password = newPasswordCopyElement.value;
    var reenteredPassword = reenterPasswordCopyElement.value;

    if (password === '') {
        isValid = false;
        showItemAndPageLevelError(
            'Enter your password',
            newPasswordCopyError,
            newPasswordCopyElement.id
        );
    }
    else if (password.length < 8 || password.length > 16) {
        isValid = false;
        showItemAndPageLevelError(
            'Enter between 8 and 16 characters',
            newPasswordCopyError,
            newPasswordCopyElement.id
        );
    }
    //run validation as it has been set up in B2C (default values as suggested here: https://msdn.microsoft.com/en-us/library/azure/jj943764.aspx )
    else if (!password.match(/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]))([A-Za-z\d@#$%^&*\-_+=[\]{}|\\:',?\/`~"();!]|\.(?!@)){8,16}$/)) {
        isValid = false;
        showItemAndPageLevelError(
            'Invalid password',
            newPasswordCopyError,
            newPasswordCopyElement.id,
            true
        );
    }
    else if (reenteredPassword === '') {
        isValid = false;
        showItemAndPageLevelError(
            'Re-enter your password',
            reenteredPasswordCopyError,
            reenterPasswordCopyElement.id
        );
    }

    else if (reenteredPassword !== '' && password !== reenteredPassword) {
        isValid = false;
        showItemAndPageLevelError(
            'Your passwords do not match',
            reenteredPasswordCopyError,
            reenterPasswordCopyElement.id
        );
    }

    //set values in b2c form if all valid
    if (isValid) {
        newPasswordElement.value = password;
        reenterPasswordElement.value = reenteredPassword;
    }

    return isValid;
}