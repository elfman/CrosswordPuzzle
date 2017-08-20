/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
} from 'react-native';
import { Provider } from 'react-redux';

import App from './js/app';
import factory from './js/store-factory';
import actions from './js/actions';

export default class CrosswordPuzzle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store: factory(),
    }
  }
  // componentDidMount() {
  //   AsyncStorage.getItem('config')
  //     .then(res => JSON.parse(res))
  //     .then((res) => {
  //       this.state.store.dispatch(actions.game.setConfig(res));
  //     });
  // }

  render() {
    return (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('CrosswordPuzzle', () => CrosswordPuzzle);
