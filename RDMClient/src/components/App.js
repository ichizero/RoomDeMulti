import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import Login from './pages/Login';
import User from './pages/User';
import Room from './pages/Room';
import NotFound from './pages/NotFound';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isAuthenticated: false };

    this.authUser = this.authUser.bind(this);
  }
  componentWillMount() {
    this.setState({ isAuthenticated: false });
  }

  authUser(userId, password) {
    // ここでサーバーに問い合わせ
    if (userId != "" && password != "") {
      this.setState({ isAuthenticated: true });
    }
    // セッションで管理しないとリロード時にstateが初期化されてしまう
  }

  render() {
    return (
      <div>
        <Route
          path="/"
          render={
            props => <Header isAuthenticated={this.state.isAuthenticated} {...props} />
          }
        />
        <main role="main" className="container">
          <Switch>
            <Route
              exact path="/"
              render={
                props => <Login isAuthenticated={this.state.isAuthenticated} authUser={this.authUser} />
              }
            />
            <Route path="/user" render={props => <User />} />
            <Route path="/room" render={props => <Room />} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    );
  }
}
