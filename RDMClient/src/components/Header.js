import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <div>
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <a className="navbar-brand" href="#">ルームDEマルチ！</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault"
        aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/user">User</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/room">Room</Link>
          </li>
        </ul>
        <button className="btn btn-outline-success my-2 my-sm-0">ログアウト</button>
      </div>
    </nav>
  </div>
);

export default Header;