import React from 'react'

export default class extends React.Component {
    static getInitialProps({req}) {
        const message = req ? req.query.message : '';
        return { message }
    }

    render() {
        return (
            <form method="post">
                <div>
                    <label>
                        <span>Username</span>
                        <input type="text" name="username"/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Password</span>
                        <input type="password" name="password"/>
                    </label>
                </div>
                <button type="submit">Sign In</button>
                <div>{this.props.message}</div>
            </form>)
    }
}