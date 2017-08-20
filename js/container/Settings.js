import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Switch,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';
import PT from 'prop-types';

import actions from '../actions';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playBackgroundMusic: null,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('playBackgroundMusic')
      .then(res => {
        this.setState({
          playBackgroundMusic: res !== 'false',
        });
      })
  }
  render() {
    const { playMusic, backgroundMusic, config } = this.props;
    const {playBackgroundMusic} = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <View style={styles.item}>
            <Text>背景音乐</Text>
            <Switch
              value={playBackgroundMusic}
              onValueChange={value => {
                this.setState({
                  playBackgroundMusic: value,
                });
                if (value) {
                  if (backgroundMusic) {
                    backgroundMusic.play();
                  } else {
                    playMusic(config.backgroundMusicName);
                  }
                } else {
                  backgroundMusic.stop();
                }
                AsyncStorage.setItem('playBackgroundMusic', value.toString());
              }}/>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  item: {
    backgroundColor: 'white',
    height: 50,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
  }
});

Settings.propTypes = {
  navigation: PT.object.isRequired,
  playMusic: PT.func.isRequired,
  backgroundMusic: PT.object,
  config: PT.shape().isRequired,
};

Settings.defaultProps = {
  backgroundMusic: null,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  playMusic: (name) => {
    dispatch(actions.game.playMusicInit());
    dispatch(actions.game.playMusicDone(name));
  },
});

const mapStateToProps = (state) => ({
  backgroundMusic: state.backgroundMusic,
  config: state.config,
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);