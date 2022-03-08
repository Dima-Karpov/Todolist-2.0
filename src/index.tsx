import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux';
import {store} from './state/store';
import {App} from './app/App';
import {BrowserRouter} from 'react-router-dom';

const rerenderEntireTree = () => {

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  
    document.getElementById('root')
  );
  
}


rerenderEntireTree()


if(process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./app/App', () => {
    rerenderEntireTree()
  })
  module.hot.accept('./state/store', () => {
    rerenderEntireTree()
  })
}
