import React from 'react';
import PropTypes from "prop-types";
// eslint-disable-next-line
import { withRouter } from "react-router";

import { ACTIONS } from './constants/actions';

import Signup from './pages/Signup';
import Login from './pages/Login';
import EmailSent from './pages/EmailSent';
import AccountLocked from './pages/AccountLocked';
import AccountActivated from './pages/AccountActivated';
import ResetPassword from './pages/ResetPassword';
import ForgottenEmail from './pages/ForgottenEmail';
import AccountNotFound from './pages/AccountNotFound';
import AccountFound from './pages/AccountFound';
import PasswordChanged from './pages/PasswordChanged';
import Placeholder from './pages/Placeholder';
import EnterNewPassword from './pages/EnterNewPassword';
import ActivateAccount from './pages/AidedRegistration/ActivateAccount';

import components from './components';

import B2CObserver from './services/B2CObserver';

class App extends React.Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    B2CObserver.setB2CErrorObservers();
  }

  matchesPath(location, path) {
    return location.pathname.search(path) !== -1;
  }

  getComponentByLocation() {
    const { location } = this.props;

    console.log(location);
    

    if (this.matchesPath(location, 'B2C_1A_signin_invitation')) {
      return <Login />;
    }
    if (this.matchesPath(location, '/signup')) {
      return <Signup />;
    }
    if (this.matchesPath(location, '/email-sent')) {
      return <EmailSent action={ACTIONS.SIGNUP} />;
    }
    if (this.matchesPath(location, '/locked')) {
      return <AccountLocked />;
    }
    if (this.matchesPath(location, '/activated')) {
      return <AccountActivated />;
    }
    if (this.matchesPath(location, '/reset-password')) {
      return <ResetPassword />;
    }
    if (this.matchesPath(location, '/reset-password-email-sent')) {
      return <EmailSent action={ACTIONS.RESET_PASSWORD} />;
    }
    if (this.matchesPath(location, '/enter-new-password')) {
      return <EnterNewPassword />;
    }
    if (this.matchesPath(location, '/password-changed')) {
      return <PasswordChanged />;
    }
    if (this.matchesPath(location, '/account-not-found')) {
      return <AccountNotFound />;
    }
    if (this.matchesPath(location, 'B2C_1A_findEmail/api')) {
      return <AccountFound />;
    }
    if (this.matchesPath(location, 'B2C_1A_findEmail')) {
      return <ForgottenEmail />;
    }
    if (this.matchesPath(location, 'B2C_1A_signup_invitation')) {
      return <ActivateAccount />;
    }
    //default
    return <Placeholder />;
  }

  render() {

    let component = this.getComponentByLocation();

    return (
      <div className="App" id="app">

        {/* header */}
        <components.Header />

        {/* routing */}
        <div id="routes">
          {component}
        </div>

        {/* footer */}
        <components.Footer />

      </div>
    )
  }
}

export default withRouter(App);