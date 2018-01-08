import React from 'react';
import { Switch, Route } from 'react-router-dom';

import request from 'superagent';
import Cookies from 'universal-cookie';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';

import Header from './Header';
import Login from './pages/Login';
import RoomList from './pages/RoomList';
import Room from './pages/Room';
import NotFound from './pages/NotFound';


const styles = {
  container: {
    padding: '3rem',
  },
};


/**
 * アプリケーションのメインクラス
 * ルーティング処理やユーザ認証を行う
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isAuthenticated: false, cookies: new Cookies() };

    this.onRegisterUser = this.onRegisterUser.bind(this);
    this.onAuthenticateUser = this.onAuthenticateUser.bind(this);
    this.onLogout = this.onLogout.bind(this);
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
   * 新規登録を行う
   * @param userId ユーザ名
   * @param password パスワード
   * @param userURL マルチURL
   */
  onRegisterUser(userId, password, userURL) {
    request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "registerUser", userId, password, userURL })
      .then(res => {
        this.state.cookies.set('userId', res.body.userId, { path: '/' });
        this.state.cookies.set('userURL', res.body.userURL, { path: '/' });
        this.setState({ isAuthenticated: true });
      })
      .catch(err => console.log("Error: %s", err.message));
  }

  /**
   * ユーザ認証を行う
   * @param userId ユーザ名
   * @param password パスワード
   */
  onAuthenticateUser(userId, password) {
    request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "authenticateUser", userId, password })
      .then(res => {
        this.state.cookies.set('userId', res.body.userId, { path: '/' });
        this.state.cookies.set('userURL', res.body.userURL, { path: '/' });
        this.setState({ isAuthenticated: true });
      })
      .catch(err => console.log("Error: %s", err.message));
  }

  /**
   * ログアウト処理を行う
   */
  onLogout() {
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
          render={props =>
            <Header
              isAuthenticated={this.state.isAuthenticated}
              onLogout={this.onLogout}
              {...props}
            />
          }
        />
        <main role="main" className={classes.container}>
          <Switch>
            <Route
              exact path="/"
              render={() =>
                <Login
                  isAuthenticated={this.state.isAuthenticated}
                  onAuthenticateUser={this.onAuthenticateUser}
                  onRegisterUser={this.onRegisterUser}
                />
              }
            />
            <Route
              exact path="/room"
              render={() =>
                <RoomList
                  isAuthenticated={this.state.isAuthenticated}
                  cookies={this.state.cookies}
                />
              }
            />
            <Route
              path="/room/:id"
              render={props =>
                <Room
                  isAuthenticated={this.state.isAuthenticated} 
                  cookies={this.state.cookies}
                  {...props}
                />
              }
            />
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
