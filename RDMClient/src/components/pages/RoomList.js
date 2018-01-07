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
      openDialog: false,
      openDialog2: false,
      roomList: [
        {
          roomId: "るーむ",
          userURL: "/tomoya",
        },
        {
          roomId: "るーむ2",
          userURL: "/mura",
        },
        {
          roomId: "るーむ3",
          userURL: "/むら",
        },
        {
          roomId: "るーむ419",
          userURL: "/419",
        },
      ],
      roomName: "",
    });

    this.onCreateRoom = this.onCreateRoom.bind(this);
    this.onDialogOpen = this.onDialogOpen.bind(this);
    this.onDialogClose = this.onDialogClose.bind(this);
    this.onDialog2Open = this.onDialog2Open.bind(this);
    this.onDialog2Close = this.onDialog2Close.bind(this);
  }

  /**
   * コンポーネントがマウントされた後に呼び出される
   */
  componentDidMount() {
    this.setState({
      userId: this.state.cookies.get('userId'),
    });
    // this.getRoomList(this.state.userId)
    //   .then(res => this.setState({ roomList: res.body }))
    //   .catch(err => console.log("Error: %s", err.message));
  }


  /**
   * ルームリストをサーバーに要求する
   * @return Promiseを返す
   */
  getRoomList(userId) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "getRoomList", userId });
  }

  /**
   * サーバーにルーム名をPOST送信する
   * @param roomId ルーム名
   * @param userId ユーザ名
   * @return Promiseを返す
   */
  createRoom(roomId, userId) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "createRoom", roomId, userId });
  }

  /**
   * サーバーにルーム名をPOST送信する
   * @param roomId ルーム名
   * @param userId ユーザ名
   * @return Promiseを返す
   */
  joinRoom(roomId, userId) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "joinRoom", roomId, userId });
  }

  /**
   * 新規ルームを登録する
   */
  onCreateRoom(e) {
    e.preventDefault();

    // if (this.state.roomName != "") {
    //   this.createRoom(this.state.roomName)
    //     .then(res => this.setState({ roomList: res.body }))
    //     .catch(err => console.log("Error: %s", err.message));
    // }

    // this.getRoomList(this.state.userId);
    this.onDialogClose();
  }

  /**
   * ルームに参加する
   */
  onJoinRoom(e) {
    e.preventDefault();

    // if (this.state.roomName != "") {
    //   this.joinRoom(this.state.roomName)
    //     .then(res => this.setState({ roomList: res.body }))
    //     .catch(err => console.log("Error: %s", err.message));
    // }

    this.onDialog2Close();
  }



  /**
   * ルーム作成ダイアログを表示する
   */
  onDialogOpen() {
    this.setState({ openDialog: true });
  }

  /**
   * ルーム作成ダイアログを閉じる
   */
  onDialogClose() {
    this.setState({ openDialog: false });
  }


  /**
   * ルーム参加ダイアログを表示する
   */
  onDialog2Open() {
    this.setState({ openDialog2: true });
  }

  /**
   * ルーム参加ダイアログを閉じる
   */
  onDialog2Close() {
    this.setState({ openDialog2: false });
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
                ルーム一覧
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Button raised color="primary" onClick={this.onDialogOpen}>ルームを作成する</Button>
            </Grid>
            <Grid item xs={6}>
              <Button raised color="primary" onClick={this.onDialog2Open}>ルームに参加する</Button>
            </Grid>

            <Grid item xs={12}>
              <List>
                {this.state.roomList.map((index) => {
                  return (
                    <div>
                      <ListItem button divider component="a" href={"/room/" + index.roomId} key={index.roomId} >
                        <ListItemText primary={index.roomId} />
                      </ListItem>
                    </div>
                  );
                })}
              </List>
            </Grid>


            <div className="createRoomDialog">
              <Dialog
                open={this.state.openDialog}
                onClose={this.onDialogClose}
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
                    id="roomName"
                    label="ルーム名"
                    type="text"
                    fullWidth
                    value={this.state.roomName}
                    onChange={(e) => this.setState({ roomName: e.target.value })}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.onDialogClose} color="primary">
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
                open={this.state.openDialog2}
                onClose={this.onDialog2Close}
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
                    id="roomName2"
                    label="ルーム名"
                    type="text"
                    fullWidth
                    value={this.state.roomName}
                    onChange={(e) => this.setState({ roomName: e.target.value })}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.onDialog2Close} color="primary">
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
