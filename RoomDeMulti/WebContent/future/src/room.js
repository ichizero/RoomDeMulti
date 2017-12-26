import React from 'react';
import ReactDOM from 'react-dom';

/**
 * ルーム画面の募集リスト・募集ダイアログを扱う
 */
class Request extends React.Component {
  constructor() {
    super();
    this.state = ({
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

    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.addRequest = this.addRequest.bind(this);
    this.getRequestList = this.getRequestList.bind(this);
  }

  componentDidMount() {
    // const newList = this.getRequestList();
    // this.setState({requestList: newList});
  }

  // 文字入力時にinputフィールドの値を更新する
  onChangeMessage(e) {
    this.setState({ requestMessage: e.target.value });
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
      list.push({
        request: this.state.requestMessage,
        url: "#xxx",
      });
      this.setState({ requestList: list, requestMessage: "" });
    }

    // 最後にリストを更新
    this.getRequestList();
  }

  render() {
    return (
      <div>
        <div className="roomHeader">
          <h1>ルーム1</h1>
        </div>

        <div className="requestDialog">
          <div className="d-flex justify-content-around">
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#requestModal">
              クエストを募集する
            </button>
          </div>

          <div className="modal fade" id="requestModal" tabIndex="-1" role="dialog" aria-labelledby="requestModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="requestModalLabel">クエストを募集する</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="requestMessage">募集文</label>
                      <input type="text" value={this.state.requestMessage} onChange={this.onChangeMessage} className="form-control" id="requestMessage" />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">キャンセル</button>
                  <button onClick={this.addRequest} className="btn btn-primary" data-dismiss="modal">募集</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="list-group">
          {this.state.requestList.map((index) => {
            return <a href={index.url} key={index.url} className="list-group-item list-group-item-action">{index.request}</a>;
          })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Request />, document.getElementById("appContainer"));
