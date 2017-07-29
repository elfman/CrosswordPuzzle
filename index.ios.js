/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';


import App from './js/components/Board';

export default class CrosswordPuzzle extends Component {
  render() {
    return (
      <App/>
    );
  }
}

AppRegistry.registerComponent('CrosswordPuzzle', () => CrosswordPuzzle);
