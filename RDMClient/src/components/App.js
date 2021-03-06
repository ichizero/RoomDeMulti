import React from 'react';
import { Switch, Route } from 'react-router-dom';

import request from 'superagent';
import Cookies from 'universal-cookie';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';

import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';

import CloseIcon from 'material-ui-icons/Close';

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
      rootPath: "/",  // Azure & local: "/", Univ: "/B09/"
      isAuthenticated: false,
      userName: "",
      userURL: "",
      isOpenSnackBar: false,
      snackmsg: "",
      cookies: new Cookies(),
    };

    this.onRegisterUser = this.onRegisterUser.bind(this);
    this.onAuthenticateUser = this.onAuthenticateUser.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.dispatchSnackBarMessage = this.dispatchSnackBarMessage.bind(this);
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
      this.state.cookies.set('userName', userName, { path: this.state.rootPath });
      this.state.cookies.set('userURL', userURL, { path: this.state.rootPath });
      this.setState({ isAuthenticated: true });
      return;
    }

    if (userName.length > 10 | password.length > 10) {
      this.dispatchSnackBarMessage("ユーザ名、パスワードは10文字以内");
    } else if (userURL.length > 100 || !userURL.match(/^(https?|ftp)(:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)$/)) {
      this.dispatchSnackBarMessage("マルチURLに誤りがあります。");
    } else {
      request.post(this.state.rootPath + "api")
        .send('func=registerUser')
        .send('userName=' + userName)
        .send("password=" + password)
        .send("userURL=" + userURL)
        .then(res => {
          this.state.cookies.set('userName', res.body.userName, { path: this.state.rootPath });
          this.state.cookies.set('userURL', res.body.userURL, { path: this.state.rootPath });
          this.setState({
            isAuthenticated: true,
            userName: res.body.userName,
            userURL: res.body.userURL,
          });
          this.dispatchSnackBarMessage("登録成功。ログインしました。");
        })
        .catch(err => this.dispatchSnackBarMessage(err.message));
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
      this.state.cookies.set('userName', userName, { path: this.state.rootPath });
      this.setState({ isAuthenticated: true });
      return;
    }

    if (userName.length > 10 | password.length > 10) {
      this.dispatchSnackBarMessage("ユーザ名、パスワードは10文字以内");
    } else {
      request.post(this.state.rootPath + "api")
        .send('func=authenticateUser')
        .send('userName=' + userName)
        .send("password=" + password)
        .then(res => {
          this.state.cookies.set('userName', res.body.userName, { path: this.state.rootPath });
          this.state.cookies.set('userURL', res.body.userURL, { path: this.state.rootPath });
          this.setState({
            isAuthenticated: true,
            userName: res.body.userName,
            userURL: res.body.userURL,
          });
          this.dispatchSnackBarMessage("ログインしました。");
        })
        .catch(err => this.dispatchSnackBarMessage(err.message));
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
    this.dispatchSnackBarMessage("ログアウトしました。");
  }

  /**
   * SnackBarを表示する
   */
  dispatchSnackBarMessage(message) {
    this.setState({
      snackmsg: message,
      isOpenSnackBar: true,
    });
  }

  /**
   * SnackBarを隠す
   */
  onCloseSnackBar() {
    this.setState({
      isOpenSnackBar: false,
      snackmsg: "",
    });
  }

  /**
   * render
   */
  render() {
    const { classes } = this.props;
    const {
      rootPath, isAuthenticated,
      userName, userURL,
      snackmsg, isOpenSnackBar
    } = this.state;

    return (
      <div>
        <Reboot />
        <Route
          path={rootPath}
          render={props =>
            <Header
              rootPath={rootPath}
              isAuthenticated={isAuthenticated}
              onLogout={this.onLogout}
              {...props}
            />
          }
        />
        <main role="main" className={classes.container}>
          <Switch>
            <Route
              exact path={rootPath}
              render={() =>
                <Login
                  rootPath={rootPath}
                  isAuthenticated={isAuthenticated}
                  onAuthenticateUser={this.onAuthenticateUser}
                  onRegisterUser={this.onRegisterUser}
                  dispatchSnackBarMessage={this.dispatchSnackBarMessage}
                />
              }
            />
            <Route
              exact path={rootPath + "room"}
              render={() =>
                <RoomList
                  rootPath={rootPath}
                  isAuthenticated={isAuthenticated}
                  userName={this.state.userName}
                  dispatchSnackBarMessage={this.dispatchSnackBarMessage}
                />
              }
            />
            <Route
              path={rootPath + "room/:id"}
              render={props =>
                <Room
                  rootPath={rootPath}
                  isAuthenticated={isAuthenticated}
                  userName={userName}
                  userURL={userURL}
                  dispatchSnackBarMessage={this.dispatchSnackBarMessage}
                  {...props}
                />
              }
            />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={isOpenSnackBar}
          autoHideDuration={6000}
          onClose={this.onCloseSnackBar}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{snackmsg}</span>}
          action={
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.onCloseSnackBar}
            >
              <CloseIcon />
            </IconButton>
          }
        />
      </div>
    );
  }
}


App.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(App);
