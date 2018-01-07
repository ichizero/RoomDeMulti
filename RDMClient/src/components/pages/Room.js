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
    console.log(props.match.params);
    this.state = ({
      isAuthenticated: props.isAuthenticated,
      cookies: props.cookies,
      roomId: props.match.params.id,
      openDialog: false,
      requestList: [
        {
          request: "イザナミ",
          url: "#1",
        },
        {
          request: "ヤマタケ",
          url: "#11",
        },
        {
          request: "クイバタ",
          url: "#22",
        },
        {
          request: "38階",
          url: "#33",
        },
        {
          request: "顔合わせ",
          url: "#333",
        },
        {
          request: "うぇーいｗｗｗ",
          url: "#444",
        },
      ],
      requestMessage: "",
    });

    this.onAddRequest = this.onAddRequest.bind(this);
    this.onRefreshList = this.onRefreshList.bind(this);
    this.onDialogOpen = this.onDialogOpen.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
  }

  /**
   * コンポーネントがマウントされた後に呼び出される
   */
  componentDidMount() {
    // this.getRequestList()
    //   .then(res => this.setState({ requestList: res.body }))
    //   .catch(err => console.log("Error: %s", err.message));
    this.setState({
      userId: this.state.cookies.get('userId'),
      userURL: this.state.cookies.get('userURL'),
    });
  }


  /**
   * リクエストリストをサーバーに要求する
   * @return Promiseを返す
   */
  getRequestList(roomId) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "getRequest", roomId });
  }

  /**
   * サーバーに募集文をPOST送信する
   * @param requestMessage 募集文
   * @return Promiseを返す
   */
  sendRequest(userId, userURL, roomId, requestMessage) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "addRequest", userId, userURL, roomId, requestMessage });
  }

  /**
   * 新規募集を登録する
   */
  onAddRequest(e) {
    e.preventDefault();

    // if (this.state.requestMessage != "") {
    //   this.sendRequest(this.state.userId, this.state.userURL,
    //     this.state.roomId, this.state.requestMessage)
    //     .then(res => this.setState({ requestList: res.body }))
    //     .catch(err => console.log("Error: %s", err.message));
    // }

    if (this.state.requestMessage != "") {
      const list = this.state.requestList;
      list.unshift({
        request: this.state.requestMessage,
        url: "#xxx",
      });
      this.setState({ requestList: list, requestMessage: "" });
    }

    // 最後にリストを更新
    // this.getRequestList();
    this.onDialogClose();
  }

  /**
   * リクエストリストを更新する
   */
  onRefreshList(e) {
    e.preventDefault();

    // this.getRequestList(this.state.roomId)
    //   .then(res => this.setState({ requestList: res.body }))
    //   .catch(err => console.log("Error: %s", err.message));
  }

  /**
   * ダイアログを表示する
   */
  onDialogOpen() {
    this.setState({ openDialog: true });
  }

  /**
   * ダイアログを閉じる
   */
  onDialogClose() {
    this.setState({ openDialog: false });
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
              <Button raised color="primary" onClick={this.onDialogOpen}>クエストを募集する</Button>
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
                    <div>
                      <ListItem button divider component="a" href={index.url} key={index.url}>
                        <ListItemText primary={index.request} />
                      </ListItem>
                    </div>
                  );
                })}
              </List>
            </Grid>

            <div className="requestDialog">
              <Dialog
                open={this.state.openDialog}
                onClose={this.onDialogClose}
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
                  <Button onClick={this.onDialogClose} color="primary">
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
