var ACTIONS = {
    SIGNUP: 'signup',
    LOGIN: 'login',
    RESET_PASSWORD: 'reset-password',
    FIND_EMAIL: 'find-email'
}

function getB2CLink (action) {
    var clientId = '488c321f-10e4-48f2-b9c2-261e2add2f8d'; 

    var actionURL;

    switch(action){
        case ACTIONS.SIGNUP:
            actionURL = 'B2C_1A_account_signup';
            break;
        case ACTIONS.LOGIN:
            actionURL = 'B2C_1A_signin_invitation';
            break;
        case ACTIONS.RESET_PASSWORD:
            actionURL = 'B2C_1A_passwordreset';
            break;
        case ACTIONS.FIND_EMAIL:
            actionURL = 'B2C_1A_findEmail';
            break;
        default:
            //point to login page by default
            actionURL = 'B2C_1A_signin_invitation';
            break;
    }

    var absolutePath = `https://__b2c-tenant__.b2clogin.com/__b2c-tenant__.onmicrosoft.com/oauth2/v2.0/` +
        `authorize?p=${actionURL}&client_id=${clientId}&nonce=defaultNonce` + 
        `&redirect_uri=__redirect-uri__&scope=openid&response_type=id_token&prompt=login`;

    return absolutePath;

}