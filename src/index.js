import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GetMetamaskPage from './GetMetamaskPage';

if(window.ethereum) {
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}
else {
  ReactDOM.render(
   <GetMetamaskPage />,
    document.getElementById('root')
  );
}


