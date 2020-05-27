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
            <header className="App-header">
              <img src="/b2c/images/logo.svg" className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reloadssss.
                  </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
                  </a>
            </header>
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
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
          <Route path="/forgotten-email">
            <ForgottenEmail />
          </Route>
          <Route path="/account-not-found">
            <AccountNotFound />
          </Route>
          <Route path="/account-found">
            <AccountFound />
          </Route>
        </Switch>
      </div>

      {/* footer */}
      <components.Footer />

    </div>
  );
}

export default App;