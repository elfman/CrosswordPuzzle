import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './components/Board';
import reducer from './reducers';

export default class Main extends Component {
  render() {
    const store = createStore(reducer);
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}