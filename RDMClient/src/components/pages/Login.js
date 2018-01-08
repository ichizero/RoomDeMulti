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


/**
 * ログイン画面を扱う
 */
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      userId: "", password: "",
      newUserId: "", newPassword: "", newUserURL: "",
      isAuthenticated: props.isAuthenticated,
      isOpenDialog: false,
    });

    this.onOpenDialog = this.onOpenDialog.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.onRegisterUser = this.onRegisterUser.bind(this);
    this.onAuthenticateUser = this.onAuthenticateUser.bind(this);
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
   * ダイアログを開く
   */
  onOpenDialog() {
    this.setState({ isOpenDialog: true });
  }

  /**
   * ダイアログを閉じる
   */
  onCloseDialog() {
    this.setState({ isOpenDialog: false });
  }

  /**
   * 新規登録を行う
   */
  onRegisterUser(e) {
    e.preventDefault();

    const userId = this.state.newUserId;
    const password = this.state.newPassword;
    const userURL = this.state.newUserURL;
    if (userId !== "" && password !== "" && userURL !== "") {
      this.props.onRegisterUser(userId, password, userURL);
      this.onCloseDialog();
    }
  }

  /**
   * ユーザ認証を行う
   */
  onAuthenticateUser(e) {
    e.preventDefault();

    const userId = this.state.userId;
    const password = this.state.password;

    if (userId !== "" && password !== "") {
      this.props.onAuthenticateUser(userId, password);
    }
  }

  /**
   * render
   */
  render() {
    const { classes } = this.props;

    return (
      this.state.isAuthenticated ?
        (
          <Redirect to="/room" />
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
              <Button raised color="primary" onClick={this.onAuthenticateUser}>ログイン</Button>
            </Grid>
            <Grid item xs={6} className={classes.tacenter}>
              <Button raised color="accent" onClick={this.onOpenDialog}>新規登録</Button>
            </Grid>

            <div className="requestDialog">
              <Dialog
                open={this.state.isOpenDialog}
                onClose={this.onCloseDialog}
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
                  <Button onClick={this.onCloseDialog} color="primary">
                    キャンセル
                  </Button>
                  <Button onClick={this.onRegisterUser} color="primary">
                    登録
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
