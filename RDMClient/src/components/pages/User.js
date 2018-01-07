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

import Refresh from 'material-ui-icons/Refresh';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isAuthenticated: props.isAuthenticated,
      openDialog: false,
      openDialog2: false,
      roomList: [
        {
          room: "るーむ1",
          url: "#1",
        },
        {
          room: "るーむ2",
          url: "#22",
        },
        {
          room: "るーむ3",
          url: "#33",
        },
        {
          room: "るーむ419",
          url: "#419",
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
    // this.getRoomList()
    //   .then(res => this.setState({ roomList: res.body }))
    //   .catch(err => console.log("Error: %s", err.message));
  }


  /**
   * ルームリストをサーバーに要求する
   * @return Promiseを返す
   */
  getRoomList() {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "getRoomName" });
  }

  /**
   * サーバーにルーム名をPOST送信する
   * @param roomName ルーム名
   * @return Promiseを返す
   */
  sendRoomName(roomName) {
    return request.post("/api")
      .set('Content-Type', 'application/json')
      .send({ func: "addRoomName", roomName });
  }

  /**
   * 新規ルームを登録する
   */
  onCreateRoom(e) {
    e.preventDefault();

    // if (this.state.roomName != "") {
    //   this.sendRoomName(this.state.roomName)
    //     .then(res => this.setState({ roomList: res.body }))
    //     .catch(err => console.log("Error: %s", err.message));
    // }

    if (this.state.roomName != "") {
      const list = this.state.roomList;
      list.unshift({
        request: this.state.roomName,
        url: "#xxx",
      });
      this.setState({ roomList: list, roomName: "" });
    }

    // 最後にリストを更新
    // this.getRoomList();
    this.onDialogClose();
  }

  /**
   * ルームに参加する
   */
  onJoinRoom(e) {
    e.preventDefault();

    // if (this.state.roomName != "") {
    //   this.sendRoomName(this.state.roomName)
    //     .then(res => this.setState({ roomList: res.body }))
    //     .catch(err => console.log("Error: %s", err.message));
    // }

    if (this.state.roomName != "") {
      const list = this.state.roomList;
      list.unshift({
        request: this.state.roomName,
        url: "#xxx",
      });
      this.setState({ roomList: list, roomName: "" });
    }
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
                ゆーざ
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button raised color="primary" onClick={this.onDialogOpen}>ルームを作成する</Button>
              <Button raised color="primary" onClick={this.onDialog2Open}>ルームに参加する</Button>
            </Grid>

            <Grid item xs={12}>
              <List>
                {this.state.roomList.map((index) => {
                  return (
                    <div>
                      <ListItem button component="a" href={index.url} key={index.url}>
                        <ListItemText primary={index.room} />
                      </ListItem>
                      <Divider />
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
                  <Button onClick={this.onCeateRoom} color="primary">
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



User.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(User);
