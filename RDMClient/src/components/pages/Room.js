import React from 'react';
import { Redirect } from 'react-router-dom';

import request from 'superagent';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';

import Refresh from 'material-ui-icons/Refresh';


const styles = {
  root: {
    flexGrow: 1,
  },
};


/**
 * ルーム画面の募集リスト・募集ダイアログを扱う
 */
class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      isAuthenticated: props.isAuthenticated,
      cookies: props.cookies,
      roomId: props.match.params.id,
      openDialog: false,
      requestList: [
        {
          request: " ",
          url: " ",
        },
      ],
      requestMessage: "",
    });

    this.onAddRequest = this.onAddRequest.bind(this);
    this.onRefreshList = this.onRefreshList.bind(this);
    this.onOpenDialog = this.onOpenDialog.bind(this);
    this.onCloseDialog = this.onCloseDialog.bind(this);
  }

  /**
   * コンポーネントがマウントされた後に呼び出される
   */
  componentDidMount() {
    this.setState({
      userId: this.state.cookies.get('userId'),
      userURL: this.state.cookies.get('userURL'),
    });

    this.getRequestList(this.state.roomId)
      .then(res => {
        const json = JSON.parse(res.text);
        this.setState({ requestList: json.requestList });
      })
      .catch(err => console.log("Error: %s", err.message));
  }

  /**
   * コンポーネントがpropsを受け取る時
   * @param nextProps 受け取るprops
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticated != nextProps.isAuthenticated) {
      this.setState({ isAuthenticated: nextProps.isAuthenticated });
    } else if (this.props.cookies != nextProps.cookies) {
      this.setState({ cookies: nextProps.cookies });
    }
  }

  /**
   * ダイアログを開く
   */
  onOpenDialog() {
    this.setState({ openDialog: true });
  }

  /**
   * ダイアログを閉じる
   */
  onCloseDialog() {
    this.setState({ openDialog: false });
  }

  /**
   * リクエストリストをサーバーに要求する
   * @return Promiseを返す
   */
  getRequestList(roomId) {
    return request.post("/api")
      .send('func=getRequest')
      .send('roomId=' + roomId);
  }

  /**
   * 新規募集を登録する
   */
  onAddRequest(e) {
    e.preventDefault();

    const userId = this.state.userId;
    const userURL = this.state.userURL;
    const roomId = this.state.roomId;
    const requestMessage = this.state.requestMessage;

    if (requestMessage !== "") {
      request.post("/api")
        .send('func=addRequest')
        .send('userId=' + userId)
        .send('userURL=' + userURL)
        .send('roomId=' + roomId)
        .send('requestMessage=' + requestMessage)
        .then(res => {
          const json = JSON.parse(res.text);
          this.setState({ requestList: json.requestList });
        })
        .catch(err => console.log("Error: %s", err.message));
    }

    this.onCloseDialog();
  }

  /**
   * リクエストリストを更新する
   */
  onRefreshList(e) {
    e.preventDefault();

    this.getRequestList(this.state.roomId)
      .then(res => {
        const json = JSON.parse(res.text);
        this.setState({ requestList: json.requestList });
      })
      .catch(err => console.log("Error: %s", err.message));
  }

  /**
   * render
   */
  render() {
    const { classes } = this.props;

    return (
      !(this.state.isAuthenticated) ?
        (
          <Redirect to="/" />
        ) : (
          <Grid container spacing={24} className={classes.root}>
            <Grid item xs={12}>
              <Typography type="display2" gutterBottom>
                {this.state.roomId}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button raised color="primary" onClick={this.onOpenDialog}>クエストを募集する</Button>
            </Grid>
            <Grid item xs={12}>
              <Button color="primary" onClick={this.onRefreshList}>
                リスト更新<Refresh />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <List>
                {this.state.requestList.map((index) => {
                  return (
                    <ListItem button divider component="a" href={index.url} key={index.url}>
                      <ListItemText primary={index.request} />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>

            <div className="requestDialog">
              <Dialog
                open={this.state.openDialog}
                onClose={this.onCloseDialog}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">クエストを募集する</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    募集文を入力してね！
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="requestMessage"
                    label="募集文"
                    type="text"
                    fullWidth
                    value={this.state.requestMessage}
                    onChange={(e) => this.setState({ requestMessage: e.target.value })}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.onCloseDialog} color="primary">
                    キャンセル
                  </Button>
                  <Button onClick={this.onAddRequest} color="primary">
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


Room.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Room);
