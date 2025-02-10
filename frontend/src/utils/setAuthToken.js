import axios from 'axios';

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
    console.log('setAuthToken: token set to', token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
    console.log('setAuthToken: token removed');
  }
};

export default setAuthToken;
  