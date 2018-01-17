import React from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import FaceIcon from 'material-ui-icons/Face';
import ExitIcon from 'material-ui-icons/ExitToApp';


const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
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
    this.props.history.push('/B09/');
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
            <IconButton className={classes.menuButton} color="contrast" aria-label="Menu">
              <FaceIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>
              <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                ルームDEマルチ！
              </Link>
            </Typography>
            {isAuthenticated && (
              <IconButton color="accent" aria-label="Logout" onClick={this.onLogout}>
                <ExitIcon />
              </IconButton>
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
