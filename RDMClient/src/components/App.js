import React from 'react';
import { Switch, Route } from 'react-router-dom';

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


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isAuthenticated: false, cookies: new Cookies() };

    this.authUser = this.authUser.bind(this);
    this.logoutUser = this.logoutUser.bind(this);
  }
  componentWillMount() {
    if (this.state.cookies.get('userId') != null) {
      this.setState({ isAuthenticated: true });
    } else {
      this.setState({ isAuthenticated: false });
    }
  }

  authUser(userId, password) {
    if (userId != "" && password != "") {
      // ここでサーバーに問い合わせ
      this.state.cookies.set('userId', 'izanami', { path: '/' });
      this.state.cookies.set('userURL', 'google.co.jp', { path: '/' });
      console.log(this.state.cookies.get('userId'));
      this.setState({ isAuthenticated: true });
    }
  }

  logoutUser() {
    if (this.state.isAuthenticated) {
      this.state.cookies.remove('userId');
      this.state.cookies.remove('userURL');
      this.setState({ isAuthenticated: false });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Reboot />
        <Route
          path="/"
          render={
            props => <Header isAuthenticated={this.state.isAuthenticated} logoutUser={this.logoutUser} {...props} />
          }
        />
        <main role="main" className={classes.container}>
          <Switch>
            <Route
              exact path="/"
              render={
                props => <Login isAuthenticated={this.state.isAuthenticated} authUser={this.authUser} />
              }
            />
            <Route path="/user" render={props => <User isAuthenticated={this.state.isAuthenticated} />} />
            <Route path="/room" render={props => <Room isAuthenticated={this.state.isAuthenticated} />} />
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
