import React from 'react';

class PageLevelErrorContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            b2cErrors: null
        };
        this.showSummaryText = this.showSummaryText.bind(this);
        // this.pageLevelErrorCallback = this.pageLevelErrorCallback.bind(this);
    }

    pageLevelErrorCallback(mutationsList, observer) {
        //flag to see if we have to refresh page level errors
        let refreshErrorsRequired = false;

        //define function here temporarily to make it work
        //function to refresh the page level errors in our govuk container with the right format
        let refreshErrors = function () {

            //get all page level error elements
            let pageErrors = document.getElementsByClassName('error pageLevel');

            // find out how many of these errors are visible
            let numVisibleItems = Array.from(pageErrors).filter(function (item) {
                return item.style.display !== 'none';
            }).length;

            // only add the error summary if there is at least one error visible
            if (numVisibleItems > 0) {
                this.setState({ b2cErrors: Array.from(pageErrors) });
            }
        }

        //loop through mutated objects to run crazy logic and update the UI accordingly
        for (let mutation of mutationsList) {

            console.log(mutation);
            

            //Determine if we will need to refresh the page level errors after the loop
            if (!refreshErrorsRequired &&
                mutation.target.classList.contains('error') &&
                mutation.target.classList.contains('pageLevel')
            ) {
                refreshErrorsRequired = true;
            }
        }

        //refresh the page level errors if there was at least one included
        if (refreshErrorsRequired) {
            refreshErrors();
        }
    }

    componentDidMount() {
        const targetNode = document.getElementById('api');

        //testing
        var p = document.createElement('p');
        p.id = 'asd';
        p.classList.add('error');
        p.classList.add('pageLevel');
        p.innerText = 'aaa';
        targetNode.appendChild(p);
        //end testing

        if (targetNode) {
            const obs = new MutationObserver(this.pageLevelErrorCallback.bind(this));
            const observerConfig = { attributes: true, childList: true, subtree: true };
            obs.observe(targetNode, observerConfig);
        }



    }

    showSummaryText() {
        return this.props.errorItems.some(item => {
            return item.showSummaryText;
        });
    };

    render() {
        const errorItems = this.props.errorItems ?
            this.props.errorItems.map(error => {
                return error ?
                    (
                        <li key={error.id}>
                            <a href={`#${error.id}`}>{error.visibleMessage}</a>
                        </li>
                    ) :
                    null
            }) :
            null;

        const b2cErrorItems = this.state.b2cErrors ?
            this.state.b2cErrors.map(error => {
                console.log(error);
                return error ?
                    (
                        <li>{error}</li>
                        // <li key={error.id}>
                        //     <a href={`#${error.id}`}>{error.visibleMessage}</a>
                        // </li>
                    ) :
                    null
            }) :
            null;

        const errorSummary = this.props.summaryTextContent && this.showSummaryText() ?
            (
                <div id="errorSummaryText">
                    {this.props.summaryTextContent}
                </div>
            ) :
            null;

        return (
            <div id="pageLevelErrorContainer" >
                <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1" data-module="govuk-error-summary">
                    <h2 className="govuk-error-summary__title" id="error-summary-title">
                        There is a problem
                        </h2>
                    {errorSummary}
                    <div className="govuk-error-summary__body">
                        <ul id="errorSummaryItems" className="govuk-list govuk-error-summary__list">
                            {errorItems}
                            {b2cErrorItems}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}

export default PageLevelErrorContainer;