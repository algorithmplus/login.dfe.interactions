import React from 'react';

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

import {
  Switch,
  Route
} from "react-router-dom";
// eslint-disable-next-line
import { withRouter } from "react-router";

class App extends React.Component {

  matchesPath(location, path) {
    return location.pathname.search(path) !== -1;
  }

  getComponentByLocation() {
    const { location } = this.props;

    console.log('Current location object:');    
    console.log(location);

    try{
      if(document){
        console.log('API element from B2C:');
        console.log(document.getElementById('api'));
      }
      else{
        console.log('Document still not available');      
      }
    }
    catch(e){
      console.log(e);
    }

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
    if (this.matchesPath(location, 'B2C_1A_signup_confirmation') ||
        this.matchesPath(location, 'B2C_1A_signup_invitation/api')) {
      return <AccountActivated />;
    }
    if (this.matchesPath(location, 'B2C_1A_signup_invitation')) {
      return <ActivateAccount />;
    }
    //default
    return <Placeholder />;
  }

  render() {

    let component = this.getComponentByLocation();
    console.log('We are going to render the component:');    
    console.log(component);
    
    return (
      <div className="App" id="app">

        {/* header */}
        <components.Header />

        {/* routing */}
        <div id="routes">
          <Switch>
            <Route path="/">
              {component}
            </Route>
          </Switch>
        </div>

        {/* footer */}
        <components.Footer />

      </div>
    )
  }
}

export default withRouter(App);