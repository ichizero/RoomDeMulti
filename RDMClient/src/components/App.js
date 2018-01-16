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
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
  },
};


/**
 * アプリケーションのメインクラス
 * ルーティング処理やユーザ認証を行う
 */
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      userName: "",
      userURL: "",
      snackmsg: "",
      cookies: new Cookies()
    };

    this.onRegisterUser = this.onRegisterUser.bind(this);
    this.onAuthenticateUser = this.onAuthenticateUser.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onCloseSnackBar = this.onCloseSnackBar.bind(this);
  }

  /**
   * コンポーネントがマウントされた後に呼び出される
   */
  componentWillMount() {
    if (this.state.cookies.get('userName') != null) {
      this.setState({
        isAuthenticated: true,
        userName: this.state.cookies.get('userName'),
        userURL: this.state.cookies.get('userURL'),
      });
    } else {
      this.setState({ isAuthenticated: false });
    }
  }

  /**
   * 新規登録を行う
   * @param userName ユーザ名
   * @param password パスワード
   * @param userURL マルチURL
   */
  onRegisterUser(userName, password, userURL) {
    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      this.state.cookies.set('userName', userName, { path: '/' });
      this.state.cookies.set('userURL', userURL, { path: '/' });
      this.setState({ isAuthenticated: true });
      return;
    }

    if (userName.length > 10 | password.length > 10) {
      this.setState({ snackmsg: "ユーザ名、パスワードは10文字以内です。" });
    } else if (userURL.length > 100) {
      this.setState({ snackmsg: "マルチURLに誤りがあります。" });
    } else {
      request.post("/api")
        .send('func=registerUser')
        .send('userName=' + userName)
        .send("password=" + password)
        .send("userURL=" + userURL)
        .then(res => {
          this.state.cookies.set('userName', res.body.userName, { path: '/' });
          this.state.cookies.set('userURL', res.body.userURL, { path: '/' });
          this.setState({
            isAuthenticated: true,
            userName: res.body.userName,
            userURL: res.body.userURL,
          });
        })
        .catch(err => this.setState({ snackmsg: err.message }));
    }
  }

  /**
   * ユーザ認証を行う
   * @param userName ユーザ名
   * @param password パスワード
   */
  onAuthenticateUser(userName, password) {
    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      this.state.cookies.set('userName', userName, { path: '/' });
      this.setState({ isAuthenticated: true });
      return;
    }

    if (userName.length > 10 | password.length > 10) {
      this.setState({ snackmsg: "ユーザ名、パスワードは10文字以内です。" });
    } else {
      request.post("/api")
        .send('func=authenticateUser')
        .send('userName=' + userName)
        .send("password=" + password)
        .then(res => {
          this.state.cookies.set('userName', res.body.userName, { path: '/' });
          this.state.cookies.set('userURL', res.body.userURL, { path: '/' });
          this.setState({
            isAuthenticated: true,
            userName: res.body.userName,
            userURL: res.body.userURL,
          });
        })
        .catch(err => this.setState({ snackmsg: err.message }));
    }
  }

  /**
   * ログアウト処理を行う
   */
  onLogout() {
    if (this.state.isAuthenticated) {
      this.state.cookies.remove('userName');
      this.state.cookies.remove('userURL');
      this.setState({ isAuthenticated: false });
    }
  }

  /**
   * SnackBarを隠す
   */
  onCloseSnackBar() {
    this.setState({ snackmsg: "" });
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
                  snackmsg={this.state.snackmsg}
                  onCloseSnackBar={this.onCloseSnackBar}
                />
              }
            />
            <Route
              exact path="/room"
              render={() =>
                <RoomList
                  isAuthenticated={this.state.isAuthenticated}
                  userName={this.state.userName}
                />
              }
            />
            <Route
              path="/room/:id"
              render={props =>
                <Room
                  isAuthenticated={this.state.isAuthenticated}
                  userName={this.state.userName}
                  userURL={this.state.userURL}
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
