import React from 'react';
import { getB2CLink } from '../../helpers/urls';
import { ACTIONS } from '../../constants/actions';

function ResendEmailLink ( props ) {

    if(props.action === ACTIONS.RESET_PASSWORD){
        return (
            <p className="govuk-body">If you don't receive an email after this time you can&nbsp;
                <a href={getB2CLink(ACTIONS.RESET_PASSWORD)}>resend password reset email</a>
                .
            </p>
        )
    }
    //Functionality to resend activation email address not ready yet, returning empty item
    if(props.action === ACTIONS.SIGNUP){
        return (
            <span></span>
        )
    }
    
}

export default ResendEmailLink;