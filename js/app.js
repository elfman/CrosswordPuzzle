import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Main from './components/Board';
import Profile from './container/Profile';
import ChooseMission from './container/ChooseMission';

export default StackNavigator({
  Home: {
    screen: Main,
    navigationOptions: ({navigation}) => ({
      // headerTitle: 'This is header title',
      header: null,
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: () => ({
      headerTitle: '游戏设置'
    })
  },
  ChooseMission: {
    screen: ChooseMission,
    navigationOptions: () => ({
      headerTitle: '选择关卡',
    })
  },
});