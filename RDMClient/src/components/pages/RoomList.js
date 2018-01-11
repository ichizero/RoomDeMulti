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


const styles = {
  root: {
    flexGrow: 1,
  },
};


class RoomList extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      isAuthenticated: props.isAuthenticated,
      cookies: props.cookies,
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
    this.setState({
      userName: this.state.cookies.get('userName'),
    });

    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      this.setState({
        roomList: [
          { roomName: "Room1" },
          { roomName: "Room2" },
          { roomName: "Room419" },
        ],
      });
      this.onCloseCreateDialog();
      return;
    }

    this.getRoomList(this.state.userName)
      .then(res => this.setState({ roomList: res.body.roomList }))
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

    if (roomName != "") {
      request.post("/api")
        .send('func=createRoom')
        .send('roomName=' + roomName)
        .send('userName=' + userName)
        .then(res => this.setState({ roomList: res.body.roomList }))
        .catch(err => console.log("Error: %s", err.message));
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
      this.onCloseCreateDialog();
      return;
    }

    const userName = this.state.userName;
    const roomName = this.state.roomName;

    if (this.state.roomName != "") {
      request.post("/api")
        .send('func=joinRoom')
        .send('roomName=' + roomName)
        .send('userName=' + userName)
        .then(res => this.setState({ roomList: res.body.roomList }))
        .catch(err => console.log("Error: %s", err.message));
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
                参加済みルーム
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Button raised color="primary" onClick={this.onOpenCreateDialog}>新規作成</Button>
            </Grid>
            <Grid item xs={6}>
              <Button raised color="primary" onClick={this.onOpenJoinDialog}>ルーム参加</Button>
            </Grid>

            <Grid item xs={12}>
              <List>
                {this.state.roomList.map((index) => {
                  return (
                    <ListItem button divider component="a" href={"/room/" + index.roomName} key={index.roomName} >
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
                    検索
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
