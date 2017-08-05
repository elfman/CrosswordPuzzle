import React, { Component } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import PT from 'prop-types';
import missionFile from '../missions.json';
import actions from '../actions';

class ChooseMission extends Component {
  _switchMission(name) {
    const { navigation, loadMission } = this.props;
    loadMission(name);
    navigation.goBack(navigation.state.params.profileKey);
  }

  render() {
    return (
      <FlatList
        style={styles.list}
        data={missionFile.missions}
        keyExtractor={item => item.name}
        renderItem={({item, index}) => {
          const { title, name } = item;
          return (
            <TouchableOpacity onPress={() => this._switchMission(name)}>
              <View style={[itemStyles.container, (index >= missionFile.missions.leng - 1) && itemStyles.noBorder]}>
                <Text style={itemStyles.text}>{title}</Text>
              </View>
            </TouchableOpacity>
          )
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
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 18,
    flex: 1,
  },
  noBorder: {
    borderBottomWidth: 0,
  }
});

ChooseMission.propTypes = {
  navigation: PT.object.isRequired,
  loadMission: PT.func.isRequired,
  currentMission: PT.string,
};

ChooseMission.defaultProps = {
  currentMission: null,
};

const mapStateToProps = state => ({
  currentMission: state.missionName,
});

const mapDispatchToProps = (dispatch) => ({
  loadMission: (name) => {
    dispatch(actions.game.loadMission(name));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseMission);