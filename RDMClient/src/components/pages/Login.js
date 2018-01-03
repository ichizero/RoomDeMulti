import React from 'react';
import { Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


const styles = {
  root: {
    flexGrow: 1,
  },
  tacenter: {
    textAlign: 'center',
  },
};


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      userId: "", password: "",
      newUserId: "", newPassword: "", newUserURL: "",
      isAuthenticated: props.isAuthenticated,
      openDialog: false,
    });

    this.authUser = this.authUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticated != nextProps.isAuthenticated) {
      this.setState({ isAuthenticated: nextProps.isAuthenticated });
    }
  }

  handleClickOpen() {
    this.setState({ openDialog: true });
  }

  handleClose() {
    this.setState({ openDialog: false });
  }

  authUser(e) {
    e.preventDefault();

    let userId = this.state.userId;
    let password = this.state.password;

    this.props.authUser(userId, password);
  }

  registerUser(e) {
    e.preventDefault();
    this.handleClose();
  }

  render() {
    const { classes } = this.props;

    return (
      this.state.isAuthenticated ?
        (
          <Redirect to="/user" />
        ) : (
          <Grid container spacing={24} className={classes.root}>
            <Grid item xs={12}>
              <form>
                <TextField
                  id="userId"
                  label="ユーザID"
                  value={this.state.userId}
                  onChange={(e) => this.setState({ userId: e.target.value })}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  id="password"
                  label="パスワード"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  type="password"
                  margin="normal"
                  fullWidth
                />
              </form>
            </Grid>
            <Grid item xs={6} className={classes.tacenter}>
              <Button raised color="primary" onClick={this.authUser}>ログイン</Button>
            </Grid>
            <Grid item xs={6} className={classes.tacenter}>
              <Button raised color="accent" onClick={this.handleClickOpen}>新規登録</Button>
            </Grid>

            <div className="requestDialog">
              <Dialog
                open={this.state.openDialog}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">新規登録</DialogTitle>
                <DialogContent>
                  <TextField
                    id="newUserId"
                    label="ユーザID"
                    value={this.state.newUserId}
                    onChange={(e) => this.setState({ newUserId: e.target.value })}
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    id="newPassword"
                    label="パスワード"
                    value={this.state.newPassword}
                    onChange={(e) => this.setState({ newPassword: e.target.value })}
                    type="password"
                    margin="normal"
                    fullWidth
                  />
                  <TextField
                    id="newUserURL"
                    label="マルチURL"
                    value={this.state.newUserURL}
                    onChange={(e) => this.setState({ newUserURL: e.target.value })}
                    margin="normal"
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleClose} color="primary">
                    キャンセル
                  </Button>
                  <Button onClick={this.registerUser} color="primary">
                    募集
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
        )
    );
  }
}


Login.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Login);
