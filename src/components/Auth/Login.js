import React from 'react';
import axios from 'axios';
import { url } from '../CardSetupForm';

const Login = ({ authenticated, setAuthenticated }) => {
  const handleLogin = async () => {
    const {
      data: { data }
    } = await axios.post(`${url}/auth/login`, {
      email: 'kartalov.pt@gmail.com',
      password: 'test1234'
    });
    const token = data.token;
    const FBIdToken = `Bearer ${token}`;
    localStorage.setItem('access_token', token);
    localStorage.setItem('FBIdToken', FBIdToken);
    axios.defaults.headers.common['Authorization'] = FBIdToken;
    setAuthenticated(true);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <button
            onClick={handleLogin}
            className="btn btn-primary btn-lg w-50 mt-5"
          >
            Login
          </button>
        </div>
        <div className="col-12 text-center mt-1">
          {authenticated ? <p className="h3">Logged In</p> : <p className="h3">Logged Out</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
