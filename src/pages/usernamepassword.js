import React from 'react'

class usernamepassword extends React.Component {
    render() {
        return (
        <form method="post">
            <div>
                <label>
                    <span>Username</span>
                    <input type="text" name="username" />
                </label>
            </div>
            <div>
                <label>
                    <span>Password</span>
                    <input type="password" name="password" />
                </label>
            </div>
            <button type="submit">Sign In</button>
        </form>)
    }
}

export default usernamepassword