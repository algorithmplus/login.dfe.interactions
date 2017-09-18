import React from 'react'
import Layout from '../components/Layout'

export default class extends React.Component {
    static getInitialProps({req}) {
        const message = req ? req.query.message : '';
        return { message }
    }

    render() {
        return (
            <Layout>
                <div>{this.props.message}</div>
                <form method="post">
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username"/>
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" />
                    </div>
                    <button type="submit">Sign In</button>

                </form>
            </Layout>
    )
    }
}