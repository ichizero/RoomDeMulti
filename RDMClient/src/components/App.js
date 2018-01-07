import React from 'react';
import { Switch, Route } from 'react-router-dom';

import request from 'superagent';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Cookies from 'universal-cookie';

import Reboot from 'material-ui/Reboot';

import Header from './Header';
import Login from './pages/Login';
import User from './pages/User';
import Room from './pages/Room';
import NotFound from './pages/NotFound';


const styles = {
  container: {
    padding: '3rem',
  },
};

/**
 * App アプリケーションのメイン
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isAuthenticated: false, cookies: new Cookies() };

    this.onRegisterUser = this.onRegisterUser.bind(this);
    this.onAuthUser = this.onAuthUser.bind(this);
    this.onLogoutUser = this.onLogoutUser.bind(this);
  }

  /**
   * コンポーネントがマウントされた後に呼び出される
   */
  componentWillMount() {
    if (this.state.cookies.get('userId') != null) {
      this.setState({ isAuthenticated: true });
    } else {
      this.setState({ isAuthenticated: false });
    }
  }

  /**
   * 新規登録をサーバーに要求する
   * @param userId ユーザ名
   * @param password パスワード
   * @param userURL マルチURL
   * @return Promiseを返す
   */
  registerRequest(userId, password, userURL) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "regi", userId, password, userURL });
  }

  /**
   * 新規登録を行う
   * @param userId ユーザ名
   * @param password パスワード
   * @param userURL マルチURL
   */
  onRegisterUser(userId, password, userURL) {
    // this.registerRequest(userId, password, userURL)
    //   .then(res => {
    //     this.state.cookies.set('userId', res.body.userId, { path: '/' });
    //     this.state.cookies.set('userURL', res.body.userURL, { path: '/' });
    //     this.setState({ isAuthenticated: true });
    //   })
    //   .catch(err => console.log("Error: %s", err.message));
    console.log("onRegisterUser on App.js");
  }

  /**
   * ユーザ認証をサーバーに要求する
   * @param userId ユーザ名
   * @param password パスワード
   * @return Promiseを返す
   */
  authRequest(userId, password) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "auth", userId, password });
  }

  /**
   * ユーザ認証を行う
   * @param userId ユーザ名
   * @param password パスワード
   */
  onAuthUser(userId, password) {
    // this.authRequest(userId, password)
    //   .then(res => {
    //     this.state.cookies.set('userId', res.body.userId, { path: '/' });
    //     this.state.cookies.set('userURL', res.body.userURL, { path: '/' });
    //     this.setState({ isAuthenticated: true });
    //   })
    //   .catch(err => console.log("Error: %s", err.message));

    this.state.cookies.set('userId', 'イザナミ', { path: '/' });
    this.state.cookies.set('userURL', '/room', { path: '/' });
    this.setState({ isAuthenticated: true });
  }

  /**
   * ログアウト処理を行う
   */
  onLogoutUser() {
    if (this.state.isAuthenticated) {
      this.state.cookies.remove('userId');
      this.state.cookies.remove('userURL');
      this.setState({ isAuthenticated: false });
    }
  }

  /**
   * render
   */
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Reboot />
        <Route
          path="/"
          render={
            props => <Header isAuthenticated={this.state.isAuthenticated} onLogoutUser={this.onLogoutUser} {...props} />
          }
        />
        <main role="main" className={classes.container}>
          <Switch>
            <Route
              exact path="/"
              render={
                props => <Login isAuthenticated={this.state.isAuthenticated} onAuthUser={this.onAuthUser} onRegisterUser={this.onRegisterUser} />
              }
            />
            <Route path="/user" render={props => <User isAuthenticated={this.state.isAuthenticated} cookies={this.state.cookies} />} />
            <Route path="/room" render={props => <Room isAuthenticated={this.state.isAuthenticated} cookies={this.state.cookies} />} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    );
  }
}


App.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(App);
