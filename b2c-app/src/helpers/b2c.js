
export function b2cHasElementWithId(id) {
    try {
        return !!document.getElementById(id);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}