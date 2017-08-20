import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Game from './container/Game';
import Profile from './container/Profile';
import ChooseMission from './container/ChooseMission';
import Settings from './container/Settings';

export default StackNavigator({
  Home: {
    screen: Game,
    navigationOptions: ({navigation}) => ({
      // headerTitle: 'This is header title',
      header: null,
    })
  },
  Profile: {
    screen: Profile,
    navigationOptions: () => ({
      headerTitle: '选项'
    })
  },
  ChooseMission: {
    screen: ChooseMission,
    navigationOptions: () => ({
      headerTitle: '选择关卡',
    })
  },
  Settings: {
    screen: Settings,
    navigationOptions: () => ({
      headerTitle: '设置'
    })
  }
});