import React from 'react';
import ReactDOM from 'react-dom';

/**
 * ログイン
 */
class Login extends React.Component {
  constructor() {
    super();
    this.state = ({
      userId: "",
      password: "",
      userURL: "",
    });

    this.onChangeUserId = this.onChangeUserId.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.validate = this.validate.bind(this);
    this.register = this.register.bind(this);
  }

  onChangeUserId(e) {
    this.setState({ userId: e.target.value });
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  validate(e) {
    e.preventDefault();
  }

  register(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="inputUserId">ユーザID</label>
            <input value={this.state.userId} onChange={this.onChangeUserId} type="text" className="form-control" id="inputUserId" placeholder="User ID" />
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword">パスワード</label>
            <input value={this.state.password} onChange={this.onChangePassword} type="password" className="form-control" id="inputPassword" placeholder="Password" />
          </div>
          <div className="d-flex justify-content-around">
            <button onClick={this.validate} className="btn btn-primary">ログイン</button>
            <button onClick={this.register} className="btn btn-info" data-toggle="modal" data-target="#registerModal">新規登録</button>
          </div>
        </form>

        <div className="registerDialog">
          <div className="modal fade" id="registerModal" tabIndex="-1" role="dialog" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="registerModalLabel">新規登録</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="inputUserId">ユーザID</label>
                      <input value={this.state.userId} onChange={this.onChangeUserId} type="text" className="form-control" id="inputUserId" placeholder="User ID" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputPassword">パスワード</label>
                      <input value={this.state.password} onChange={this.onChangePassword} type="password" className="form-control" id="inputPassword" placeholder="Password" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="inputPassword">マルチURL</label>
                      <input value={this.state.userURL} onChange={this.onChangeUserURL} type="text" className="form-control" id="inputUserURL" placeholder="Multi URL" />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">キャンセル</button>
                  <button onClick={this.addregister} className="btn btn-primary" data-dismiss="modal">登録</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById("appContainer"));
