import React from 'react';

export default class extends React.Component {
    static async getInitialProps({req}) {
        let body = [];
        Object.keys(req.body).forEach((key) => {
            let value = req.body[key];
            body[body.length] = {key,value};
        })
        return {body}
    }

    render() {
        var stationComponents = this.props.body.map(function(field) {
            return <li key={field.keys}>{field.key} = {field.value}</li>;
        });
        return (
            <div>
                <div>
                    <h2>Interaction complete!</h2>
                    <p>Here is the output of the interaction:</p>
                </div>
                <ul>{stationComponents}</ul>
            </div>
        );
    }
}