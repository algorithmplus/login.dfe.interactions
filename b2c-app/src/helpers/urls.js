export function getB2CLink (action) {

    const clientId = '488c321f-10e4-48f2-b9c2-261e2add2f8d'; 

    let actionURL;

    switch(action){
        case 'signup':
            actionURL = 'B2C_1A_account_signup';
            break;
        default:
            //point to login page by default
            actionURL = 'B2C_1A_signin_invitation';
            break;
    }

    let relativePath = `authorize?p=${actionURL}&client_id=${clientId}&nonce=defaultNonce` + 
        `&redirect_uri=https%3A%2F%2Fjwt.ms&scope=openid&response_type=id_token&prompt=login`;    

    return relativePath;

}