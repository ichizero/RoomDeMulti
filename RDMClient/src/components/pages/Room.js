import React from 'react';
import { Redirect } from 'react-router-dom';

import request from 'superagent';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import Grid from 'material-ui/Grid';
import List, { ListItem } from 'material-ui/List';
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
import Avatar from 'material-ui/Avatar';

import AddIcon from 'material-ui-icons/Add';
import RefreshIcon from 'material-ui-icons/Refresh';


const styles = {
  root: {
    flexGrow: 1,
    maxWidth: "560px",
  },
  h1title: {
    paddingTop: "24px",
  },
  listTopDiv: {
    margin: "0 -2rem",
  },
  list: {
    padding: 0,
    margin: "0 -2rem",
  },
  avatar: {
    marginRight: "16px",
    color: '#fff',
    backgroundColor: "lightblue",
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
      userName: props.userName,
      userURL: props.userURL,
      roomName: props.match.params.id,
      openDialog: false,
      requestList: [
        {
          requestMessage: " ",
          userName: " ",
          userURL: " ",
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
    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      this.setState({
        requestList: [
          {
            requestMessage: "あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ",
            userName: "User1",
            userURL: "#userurl1",
          },
          {
            requestMessage: "一緒にマルチやろう！",
            userName: "モンスト太郎",
            userURL: "#userurl2",
          },
        ],
      });
      this.onCloseDialog();
      return;
    }

    this.getRequestList(this.state.roomName)
      .then(res => this.setState({ requestList: res.body.requestList }))
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
    } else if (this.props.userURL != nextProps.userURL) {
      this.setState({ userName: nextProps.userURL });
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
    this.setState({
      openDialog: false,
      requestMessage: ""
    });
  }

  /**
   * リクエストリストをサーバーに要求する
   * @return Promiseを返す
   */
  getRequestList(roomName) {
    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    return request.post("/api")
      .send('func=getRequest')
      .send('roomName=' + roomName);
  }

  /**
   * 新規募集を登録する
   */
  onAddRequest(e) {
    e.preventDefault();

    // Development環境でのダミー処理
    // if (process.env.NODE_ENV !== "production") {
    //   this.onCloseDialog();
    //   return;
    // }

    const userName = this.state.userName;
    const userURL = this.state.userURL;
    const roomName = this.state.roomName;
    const requestMessage = this.state.requestMessage;

    if (requestMessage.length > 50) {
      this.dispatchSnackBarMessage("募集文は50文字以内です。");
    } else if (requestMessage !== "") {
      request.post("/api")
        .send('func=addRequest')
        .send('userName=' + userName)
        .send('userURL=' + userURL)
        .send('roomName=' + roomName)
        .send('requestMessage=' + requestMessage)
        .then(res => this.setState({ requestList: res.body.requestList }))
        .catch(err => this.dispatchSnackBarMessage(err.message));
    }

    this.onCloseDialog();
  }

  /**
   * リクエストリストを更新する
   */
  onRefreshList(e) {
    e.preventDefault();

    // Development環境でのダミー処理
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    this.getRequestList(this.state.roomName)
      .then(res => this.setState({ requestList: res.body.requestList }))
      .catch(err => this.dispatchSnackBarMessage(err.message));
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
                {this.state.roomName}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container justify={"center"} spacing={40}>
                <Grid item>
                  <Button raised color="primary" onClick={this.onOpenDialog}>募集<AddIcon /></Button>
                </Grid>
                <Grid item>
                  <Button color="primary" onClick={this.onRefreshList}>
                    リスト更新<RefreshIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider className={classes.listTopDiv}/>
              <List className={classes.list}>
                {this.state.requestList.map((index) => {
                  const avatar = index.userName.charAt(0);
                  return (
                    <ListItem button divider component="a" href={index.userURL} key={index.userName}>
                      <Avatar className={classes.avatar}>{avatar}</Avatar>
                      <div>
                        <Typography noWrap>{index.userName}</Typography>
                        <Typography type="subheading">{index.requestMessage}</Typography>
                      </div>
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
