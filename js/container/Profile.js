import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import PT from 'prop-types';

import { resetMission } from '../utils';
import arrow from '../../resources/images/arrow.png';
import actions from '../actions';

const listItems = [
  {
    title: '选择关卡',
    path: 'ChooseMission',
  },
  {
    title: '重置本关',
    rightText: '第3关',
    onPress: _.noop,
  }
];

class Profile extends Component {
  profileItems = [
    {
      title: '选择关卡',
      path: 'ChooseMission',
    },
    {
      title: '重置本关',
      rightText: this.props.missionName,
      onPress: () => {
        const { missionName, loadMission, navigation } = this.props;
        Alert.alert(missionName, '确定要重置本关卡？', [
          {text: '取消', onPress: _.noop},
          {text: '确定', onPress: () => {
            resetMission(missionName);
            loadMission(missionName);
            navigation.goBack();
          }}
        ]);
      },
    }
  ];


  render() {
    const {navigation} = this.props;
    return (
      <FlatList
        style={styles.list}
        data={this.profileItems}
        keyExtractor={item => item.title}
        renderItem={({item, index}) => {
          const { onPress, rightText, title, path } = item;
          return (
            <TouchableOpacity
              onPress={onPress ? onPress :
                (path && (() => navigation.navigate(path, {profileKey: navigation.state.key})))}
            >
              <View style={[itemStyles.container, (index >= listItems.length - 1) && itemStyles.noBorder]}>
                <Text style={itemStyles.title}>{title}</Text>
                <View style={itemStyles.right}>
                  { rightText && <Text style={itemStyles.rightText}>{rightText}</Text> }
                  {onPress && <Image style={itemStyles.arrow} source={arrow}/>}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
  list: {
    marginTop: 30,
  }
});

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 40,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    borderColor: '#777',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  right: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: 120,
    marginRight: 10,
  },
  rightText: {
    fontSize: 18,
    color: '#888',
  },
  arrow: {
    marginLeft: 6,
    width: 14,
    height: 18,
    marginTop: 2,
  },
  noBorder: {
    borderBottomWidth: 0,
  }
});

Profile.propTypes = {
  missionName: PT.string.isRequired,
  loadMission: PT.func.isRequired,
  navigation: PT.object.isRequired,
};

const mapStateToProps = state => ({
  missionName: state.missionName,
});

const mapDispatchToProps = dispatch => ({
  loadMission: (name) => {
    dispatch(actions.game.loadMission(name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

