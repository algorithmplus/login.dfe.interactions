import React from 'react';

import "./TermsAndConditions.scss";

class TermsAndConditions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tsAndCsAccepted: null,
            errors: {
                tsAndCs: {
                    currentMessage: 'You must accept our Terms and Conditions',
                    visibleMessage: '',
                    id: 'tsAndCsCustom'
                }
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.isValidTsAndCs = this.isValidTsAndCs.bind(this);

        //initialise errors in parent component, which will contain a reference to them
        props.onError(this.state.errors);
    }

    handleChange(e) {
        e.preventDefault();

        const { name, checked } = e.target;

        this.setState({ [name]: checked }, () => {
            if (this.isValidTsAndCs()) {
                //update data in the page state
                this.props.onChange({ tsAndCsAccepted: this.state.tsAndCsAccepted });
            }
        });
    }

    isValidTsAndCs() {
        let isValid = true;
        let errors = this.state.errors;

        //clear errors
        errors.tsAndCs.currentMessage = '';

        if (!this.state.tsAndCsAccepted) {
            isValid = false;
            errors.tsAndCs.currentMessage = 'You must accept our Terms and Conditions';
        }

        this.setState({ errors });

        return isValid;
    }

    render() {

        const { errors } = this.state;

        const tsAndCsErrorElement = this.props.showErrors && errors.tsAndCs.visibleMessage.length > 0 ?
            (
                <span id="tsAndCsError" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>
                    {errors.tsAndCs.visibleMessage}
                </span>
            ) :
            null;

        return (

            <div>
                <h1 className='govuk-heading-m'>Terms and conditions</h1>
                <div className="govuk-form-group">
                    {tsAndCsErrorElement}
                    <label className="block-label" htmlFor="tsAndCsCustom">
                        <input id="tsAndCsCustom" name="tsAndCsAccepted" type="checkbox" value="true" aria-invalid="true" onChange={this.handleChange} noValidate />
                        I accept the&nbsp;
                        <a href="https://nationalcareers.service.gov.uk/help/terms-and-conditions" id="tsAndCsLink" target="_blank" rel="noopener noreferrer" >
                            terms and conditions
                        </a>
                        &nbsp;and I am 13 or over
                    </label>
                </div>
            </div>
        )
    }
}

export default TermsAndConditions;