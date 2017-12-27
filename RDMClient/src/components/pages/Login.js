import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isAuthenticated: props.isAuthenticated,
    });

    this.authUser = this.authUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isAuthenticated != nextProps.isAuthenticated) {
      this.setState({ isAuthenticated: nextProps.isAuthenticated });
    }
  }

  authUser(e) {
    e.preventDefault();

    let userId = this.refs.userId.value;
    let password = this.refs.password.value;
    
    this.props.authUser(userId, password);
  }

  registerUser(e) {
    e.preventDefault();
  }

  render() {
    return (
      this.state.isAuthenticated ?
        (
          <Redirect to="/user" />
        ) : (
          <div>
            <form>
              <div className="form-group">
                <label htmlFor="inputUserId">ユーザID</label>
                <input ref="userId" type="text" className="form-control" id="inputUserId" placeholder="User ID" />
              </div>
              <div className="form-group">
                <label htmlFor="inputPassword">パスワード</label>
                <input ref="password" type="password" className="form-control" id="inputPassword" placeholder="Password" />
              </div>
              <div className="d-flex justify-content-around">
                <button onClick={this.authUser} className="btn btn-primary">ログイン</button>
                <button onClick={this.registerUser} className="btn btn-info" data-toggle="modal" data-target="#registerModal">新規登録</button>
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
                          <label htmlFor="regiUserId">ユーザID</label>
                          <input ref="newUserId" type="text" className="form-control" id="regiUserId" placeholder="User ID" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="regiPassword">パスワード</label>
                          <input ref="newPassword" type="password" className="form-control" id="regiPassword" placeholder="Password" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="regiPassword">マルチURL</label>
                          <input ref="newUserURL" type="text" className="form-control" id="regiUserURL" placeholder="Multi URL" />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">キャンセル</button>
                      <button onClick={this.registerUser} className="btn btn-primary" data-dismiss="modal">登録</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    );
  }
}
