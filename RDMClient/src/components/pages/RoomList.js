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
          roomId: " ",
        },
      ],
      roomId: "",
      newRoomId: "",
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
      userId: this.state.cookies.get('userId'),
    });

    this.getRoomList(this.state.userId)
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
  getRoomList(userId) {
    return request.post("/api")
      .send('func=getRoomList')
      .send('userId=' + userId);
  }

  /**
   * 新規ルームを登録する
   */
  onCreateRoom(e) {
    e.preventDefault();

    const roomId = this.state.newRoomId;
    const userId = this.state.userId;

    if (roomId != "") {
      request.post("/api")
        .send('func=createRoom')
        .send('roomId=' + roomId)
        .send('userId=' + userId)
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

    const roomId = this.state.roomId;
    const userId = this.state.userId;

    if (this.state.roomId != "") {
      request.post("/api")
        .send('func=joinRoom')
        .send('roomId=' + roomId)
        .send('userId=' + userId)
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
    this.setState({ isOpenCreateDialog: false });
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
    this.setState({ isOpenJoinDialog: false });
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
                    <ListItem button divider component="a" href={"/room/" + index.roomId} key={index.roomId} >
                      <ListItemText primary={index.roomId} />
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
                    id="newRoomId"
                    label="ルーム名"
                    type="text"
                    fullWidth
                    value={this.state.newRoomId}
                    onChange={(e) => this.setState({ newRoomId: e.target.value })}
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
                    id="roomId"
                    label="ルーム名"
                    type="text"
                    fullWidth
                    value={this.state.roomId}
                    onChange={(e) => this.setState({ roomId: e.target.value })}
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
