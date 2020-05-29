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

import components from './components';

import {
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App" id="app">

      {/* header */}
      <components.Header />

      {/* routing */}
      <div id="routes">
        <Switch>
          <Route exact path="/">
            <Placeholder />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path={/B2C_1A_signin_invitation/}>
            <Login />
          </Route>
          <Route path="/email-sent"
            render = { () => <EmailSent action={ACTIONS.SIGNUP} />}
            />
          <Route path="/locked">
            <AccountLocked />
          </Route>
          <Route path="/activated">
            <AccountActivated />
          </Route>
          <Route path="/reset-password">
            <ResetPassword />
          </Route>
          <Route path="/reset-password-email-sent"
            render = { () => <EmailSent action={ACTIONS.RESET_PASSWORD} />}
            />
          <Route path={/B2C_1A_passwordResetConformation/}>
            <EnterNewPassword />
          </Route>
          <Route path="/password-changed">
            <PasswordChanged />
          </Route>
          <Route path="/forgotten-email">
            <ForgottenEmail />
          </Route>
          <Route path="/account-not-found">
            <AccountNotFound />
          </Route>
          <Route path="/account-found">
            <AccountFound />
          </Route>
          <Route>
            <div>Page not found!</div>
          </Route>
        </Switch>
      </div>

      {/* footer */}
      <components.Footer />

    </div>
  );
}

export default App;