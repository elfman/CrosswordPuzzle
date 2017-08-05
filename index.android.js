/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import { Provider } from 'react-redux';

import App from './js/app';
import factory from './js/store-factory';

export default class CrosswordPuzzle extends Component {
  render() {
    const store = factory();
    store.subscribe()

    return (
      <Provider store={factory()}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('CrosswordPuzzle', () => CrosswordPuzzle);
