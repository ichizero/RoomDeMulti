import React from 'react';
import { Redirect } from 'react-router-dom';

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


/**
 * ルーム画面の募集リスト・募集ダイアログを扱う
 */
class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isAuthenticated: props.isAuthenticated,
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

    this.addRequest = this.addRequest.bind(this);
    this.getRequestList = this.getRequestList.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    // const newList = this.getRequestList();
    // this.setState({requestList: newList});
  }

  handleClickOpen() {
    this.setState({ openDialog: true });
  }

  handleClose() {
    this.setState({ openDialog: false });
  }

  // 募集リストをGETして返す
  getRequestList() {

  }

  // 新規募集をPOSTする
  addRequest(e) {
    e.preventDefault();
    // TODO
    // ここでサーバーにPOSTして
    // GETする

    if (this.state.requestMessage != "") {
      const list = this.state.requestList;
      list.unshift({
        request: this.state.requestMessage,
        url: "#xxx",
      });
      this.setState({ requestList: list, requestMessage: "" });
    }

    // 最後にリストを更新
    this.getRequestList();
    this.handleClose();
  }
  
  refreshList(e) {
    e.preventDefault();

  }

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
                るーむ419
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button raised color="primary" onClick={this.handleClickOpen}>クエストを募集する</Button>
            </Grid>
            <Grid item xs={12}>
              <Button color="primary" onClick={this.refreshList}>
                リスト更新<Refresh />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <List>
                {this.state.requestList.map((index) => {
                  return (
                    <div>
                      <ListItem button component="a" href={index.url} key={index.url}>
                        <ListItemText primary={index.request} />
                      </ListItem>
                      <Divider />
                    </div>
                  );
                })}
              </List>
            </Grid>

            <div className="requestDialog">
              <Dialog
                open={this.state.openDialog}
                onClose={this.handleClose}
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
                  <Button onClick={this.handleClose} color="primary">
                    キャンセル
                  </Button>
                  <Button onClick={this.addRequest} color="primary">
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
