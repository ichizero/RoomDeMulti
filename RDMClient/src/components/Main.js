import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import User from './pages/User';
import Room from './pages/Room';
import NotFound from './pages/NotFound';

const Main = () => (
  <main role="main" className="container">
    <Switch>
      <Route exact path="/" render={props => <Login />} />
      <Route path="/user" render={props => <User />} />
      <Route path="/room" render={props => <Room />} />
      <Route component={NotFound} />
    </Switch>
  </main>
);

export default Main;