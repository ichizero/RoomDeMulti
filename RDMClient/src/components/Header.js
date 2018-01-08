import React from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';


const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};


/**
 * ヘッダーを扱う
 */
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isAuthenticated: props.isAuthenticated };

    this.onLogout = this.onLogout.bind(this);
  }

  /**
   * コンポーネントがpropsを受け取る時
   * @param nextProps 受け取るprops
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticated != nextProps.isAuthenticated) {
      this.setState({ isAuthenticated: nextProps.isAuthenticated });
    }
  }

  /**
   * ログアウト処理を行う
   */
  onLogout(e) {
    e.preventDefault();

    this.props.onLogout();
    this.props.history.push('/');
  }

  /**
   * render
   */
  render() {
    const { classes } = this.props;
    const { isAuthenticated } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                ルームDEマルチ！
              </Link>
            </Typography>
            {isAuthenticated && (
              <Button raised color="accent" onClick={this.onLogout} >ログアウト</Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}


Header.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Header);
