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

import PersonIcon from 'material-ui-icons/Person';
import PersonAddIcon from 'material-ui-icons/PersonAdd';


const styles = {
  root: {
    flexGrow: 1,
    maxWidth: "560px",
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
      userName: "", password: "",
      newUserName: "", newPassword: "", newUserURL: "",
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
    this.setState({
      isOpenDialog: false,
      newUserName: "",
      newUserURL: "",
      newPassword: ""
    });
  }

  /**
   * 新規登録を行う
   */
  onRegisterUser(e) {
    e.preventDefault();

    const userName = this.state.newUserName;
    const password = this.state.newPassword;
    const userURL = this.state.newUserURL;
    if (userName !== "" && password !== "" && userURL !== "") {
      this.props.onRegisterUser(userName, password, userURL);
      this.onCloseDialog();
    }
  }

  /**
   * ユーザ認証を行う
   */
  onAuthenticateUser(e) {
    e.preventDefault();

    const userName = this.state.userName;
    const password = this.state.password;

    if (userName !== "" && password !== "") {
      this.props.onAuthenticateUser(userName, password);
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
          <Redirect to="/B09/room" />
        ) : (
          <Grid container justify={"center"} spacing={24} className={classes.root}>
            <Grid item xs={12}>
              <form>
                <TextField
                  id="userName"
                  label="ユーザ名"
                  value={this.state.userName}
                  onChange={(e) => this.setState({ userName: e.target.value })}
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
              <Button raised color="primary" onClick={this.onAuthenticateUser}>ログイン<PersonIcon /></Button>
            </Grid>
            <Grid item xs={6} className={classes.tacenter}>
              <Button raised color="accent" onClick={this.onOpenDialog}>新規登録<PersonAddIcon /></Button>
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
                    id="newUserName"
                    label="ユーザ名"
                    value={this.state.newUserName}
                    onChange={(e) => this.setState({ newUserName: e.target.value })}
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
