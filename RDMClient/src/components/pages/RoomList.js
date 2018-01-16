import React from 'react';
import { Redirect } from 'react-router-dom';

import request from 'superagent';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';

import GroupIcon from 'material-ui-icons/Group';
import GroupAddIcon from 'material-ui-icons/GroupAdd';


const styles = {
  root: {
    flexGrow: 1,
    maxWidth: "560px",
  },
  listTopDiv: {
    margin: "0 -2rem",
  },
  list: {
    padding: 0,
    margin: "0 -2rem",
  },
  roomItem: {
    paddingLeft: "3rem",
    paddingRight: "3rem",
  },
  h1title: {
    paddingTop: "24px",
  },
};


class RoomList extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      isAuthenticated: props.isAuthenticated,
      userName: props.userName,
      isOpenCreateDialog: false,
      isOpenJoinDialog: false,
      roomList: [
        {
          roomName: " ",
        },
      ],
      roomName: "",
      newRoomName: "",
    });

    this.onCreateRoom = this.onCreateRoom.bind(this);
    this.onJoinRoom = this.onJoinRoom.bind(this);
    this.onOpenCreateDialog = this.onOpenCreateDialog.bind(this);
    this.onCloseCreateDialog = this.onCloseCreateDialog.bind(this);
    this.onOpenJoinDialog = this.onOpenJoinDialog.bind(this);
    this.onCloseJoinDialog = this.onCloseJoinDialog.bind(this);
  }

  /**
   * コンポーネントがマウントされた後に呼び出される
   */
  componentDidMount() {
    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      this.setState({
        roomList: [
          { roomName: "Room1" },
          { roomName: "Room2" },
          { roomName: "あのイーハトーヴォの" },
        ],
      });
      this.onCloseCreateDialog();
      return;
    }

    this.getRoomList(this.state.userName)
      .then(res => this.setState({ roomList: res.body.roomList }))
      .catch(err => this.dispatchSnackBarMessage(err.message));
  }

  /**
   * コンポーネントがpropsを受け取る時
   * @param nextProps 受け取るprops
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticated != nextProps.isAuthenticated) {
      this.setState({ isAuthenticated: nextProps.isAuthenticated });
    } else if (this.props.userName != nextProps.userName) {
      this.setState({ userName: nextProps.userName });
    }
  }

  /**
   * ルームリストをサーバーに要求する
   * @return Promiseを返す
   */
  getRoomList(userName) {
    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    return request.post("/api")
      .send('func=getRoomList')
      .send('userName=' + userName);
  }

  /**
   * 新規ルームを登録する
   */
  onCreateRoom(e) {
    e.preventDefault();

    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      this.onCloseCreateDialog();
      return;
    }

    const userName = this.state.userName;
    const roomName = this.state.newRoomName;

    if (roomName.length > 10) {
      this.dispatchSnackBarMessage("ルーム名は10文字以内です。");
    } else if (roomName != "") {
      request.post("/api")
        .send('func=createRoom')
        .send('roomName=' + roomName)
        .send('userName=' + userName)
        .then(res => this.setState({ roomList: res.body.roomList }))
        .catch(err => this.dispatchSnackBarMessage(err.message));
    }

    this.onCloseCreateDialog();
  }

  /**
   * ルームに参加する
   */
  onJoinRoom(e) {
    e.preventDefault();

    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      this.onCloseJoinDialog();
      return;
    }

    const userName = this.state.userName;
    const roomName = this.state.roomName;

    if (roomName.length > 10) {
      this.dispatchSnackBarMessage("ルーム名は10文字以内です。");
    } else if (this.state.roomName != "") {
      request.post("/api")
        .send('func=joinRoom')
        .send('roomName=' + roomName)
        .send('userName=' + userName)
        .then(res => this.setState({ roomList: res.body.roomList }))
        .catch(err => this.dispatchSnackBarMessage(err.message));
    }

    this.onCloseJoinDialog();
  }

  /**
   * ルーム作成ダイアログを表示する
   */
  onOpenCreateDialog() {
    this.setState({ isOpenCreateDialog: true });
  }

  /**
   * ルーム作成ダイアログを閉じる
   */
  onCloseCreateDialog() {
    this.setState({
      isOpenCreateDialog: false,
      newRoomName: ""
    });
  }

  /**
   * ルーム参加ダイアログを表示する
   */
  onOpenJoinDialog() {
    this.setState({ isOpenJoinDialog: true });
  }

  /**
   * ルーム参加ダイアログを閉じる
   */
  onCloseJoinDialog() {
    this.setState({
      isOpenJoinDialog: false,
      roomName: ""
    });
  }

  /**
   * SnackBarを表示する
   */
  dispatchSnackBarMessage(message) {
    this.props.dispatchSnackBarMessage(message);
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
          <Grid container justify={"center"} spacing={24} className={classes.root}>
            <Grid item>
              <Typography type="display1" gutterBottom className={classes.h1title}>
                参加済みルーム
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify={"center"} spacing={40}>
                <Grid item>
                  <Button raised color="primary" onClick={this.onOpenJoinDialog}>ルーム参加<GroupIcon /></Button>
                </Grid>
                <Grid item>
                  <Button raised color="accent" onClick={this.onOpenCreateDialog}>新規作成<GroupAddIcon /></Button>
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={12}>
              <Divider className={classes.listTopDiv}/>
              <List className={classes.list}>
                {this.state.roomList.map((index) => {
                  return (
                    <ListItem className={classes.roomItem} button divider component="a" href={"/room/" + index.roomName} key={index.roomName} >
                      <ListItemText primary={index.roomName} />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>


            <div className="createRoomDialog">
              <Dialog
                open={this.state.isOpenCreateDialog}
                onClose={this.onCloseCreateDialog}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">ルームを作成する</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    ルーム名を入力してね！
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="newRoomName"
                    label="ルーム名"
                    type="text"
                    fullWidth
                    value={this.state.newRoomName}
                    onChange={(e) => this.setState({ newRoomName: e.target.value })}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.onCloseCreateDialog} color="primary">
                    キャンセル
                  </Button>
                  <Button onClick={this.onCreateRoom} color="primary">
                    作成
                  </Button>
                </DialogActions>
              </Dialog>
            </div>

            <div className="joinRoomDialog">
              <Dialog
                open={this.state.isOpenJoinDialog}
                onClose={this.onCloseJoinDialog}
                aria-labelledby="form-dialog2-title"
              >
                <DialogTitle id="form-dialog2-title">ルームに参加する</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    ルーム名を入力してね！
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="roomName"
                    label="ルーム名"
                    type="text"
                    fullWidth
                    value={this.state.roomName}
                    onChange={(e) => this.setState({ roomName: e.target.value })}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.onCloseJoinDialog} color="primary">
                    キャンセル
                  </Button>
                  <Button onClick={this.onJoinRoom} color="primary">
                    参加
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Grid>
        )
    );
  }
}


RoomList.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(RoomList);
