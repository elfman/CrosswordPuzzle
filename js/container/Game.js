import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  AsyncStorage,
  AppState,
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import PT from 'prop-types';
import Sound from 'react-native-sound';

import Grid from '../components/Grid';
import Note from '../components/Note';
import BottomLayout from '../components/BottomLayout';
import TopLayout from '../components/TopLayout';
import { saveMission } from '../utils';
import config from '../config/config';
import actions from '../actions';

function setGridUserInput(grid, newInput) {
  if (grid.userInput !== grid.text) {
    grid.userInput = newInput;
  }
}

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
    };

    this._onGridPress = this._onGridPress.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._onHintClick = this._onHintClick.bind(this);
    this._onBlankAreaClick = this._onBlankAreaClick.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this._openProfile = this._openProfile.bind(this);
  }


  _saveMission() {
    const { missionName, board} = this.props;
    saveMission(missionName, board);
  }

  _handleAppStateChange(nextAppState) {
    const { appState } = this.state;
    const { backgroundMusic, playMusic, loadingMusic } = this.props;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      if (backgroundMusic) {
        backgroundMusic.play();
      } else if (!loadingMusic) {
        playMusic(config.backgroundMusic);
      }
    } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    }
    this.setState({appState: nextAppState});
  }

  componentWillMount() {
    const { playMusic, loadingMusic, loadMission, backgroundMusic } = this.props;
    if (!loadingMusic && !backgroundMusic) {
      playMusic(config.backgroundMusic);
    }
    AsyncStorage.getItem('lastPlayedMission').then(result => {
      loadMission(result);
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    const { backgroundMusic } = this.props;
    if (backgroundMusic) {
      backgroundMusic.stop();
      backgroundMusic.release();
    }
    AppState.removeEventListener('change', this._handleAppStateChange);
    this._saveMission();
  }

  _onBlankAreaClick() {
    this.props.clearSelected();
  }

  _onGridPress(x, y) {
    const { selectedPos, board, activeDirection, changeActiveDirection, selectGrid } = this.props;
    const selectedGrid = board[y][x];

    if (selectedPos && selectedPos.x === x && selectedPos.y === y) {
      if ((activeDirection && selectedGrid.verticalWord) || (!activeDirection && selectedGrid.horizontalWord)) {
        changeActiveDirection(!activeDirection);
      }
    } else {
      changeActiveDirection(!!selectedGrid.horizontalWord);
    }
    selectGrid(x, y);
  }

  _onHintClick() {
    const { board, selectedPos, requestHint } = this.props;
    if (!selectedPos) {
      return;
    }

    if (board[selectedPos.y][selectedPos.x].userInput !== board[selectedPos.y][selectedPos.x].text) {
      requestHint(selectedPos.x, selectedPos.y);
    }
  }

  _handleInput(input) {
    const { selectedPos, board, activeDirection, inputWord } = this.props;
    if (!selectedPos || !input) {
      return;
    }
    const selectedGrid = board[selectedPos.y][selectedPos.x];

    const positions = [];
    if (input.length === 1) {
      positions.push({ x: selectedPos.x, y: selectedPos.y, input: input });
    } else if (activeDirection) {
      const y = selectedPos.y;
      if (input.length === selectedGrid.horizontalWord.length) {
        for (let i = 0; i < selectedGrid.horizontalWord.length; i++) {
          positions.push({
            x: selectedGrid.horizontalStart + i,
            y: y,
            input: input[i]
          });
        }
      } else {
        for (let i = 0; i < input.length && board[y][selectedPos.x + i].horizontalWord; i++) {
          positions.push({
            x: selectedPos.x + i,
            y: y,
            input: input[i],
          });
        }
      }
    } else {
      const x = selectedPos.x;
      if (input.length === selectedGrid.verticalWord.length) {
        for (let i = 0; i < selectedGrid.verticalWord.length; i++) {
          positions.push({
            x: x,
            y: selectedGrid.verticalStart + i,
            input: input[i],
          });
        }
      } else {
        for (let i = 0; i < input.length && board[selectedPos.y + i][x].verticalWord; i++) {
          positions.push({
            x: x,
            y: selectedPos.y + i,
            input: input[i],
          });
        }
      }
    }
    if (positions.length > 0) {
      inputWord(positions);
    }
  }

  _openProfile() {
    const { navigate } = this.props.navigation;
    navigate('Profile');
  }

  render() {
    const { board, selectedPos, activeDirection } = this.props;
    const selectedGrid = selectedPos && board[selectedPos.y][selectedPos.x];
    const grids = [];

    board && board.map((line, y) => {
      line.map((grid, x) => {
        let active = false;
        if (selectedPos) {
          if (activeDirection) {
            active = (y === selectedPos.y && x >= selectedGrid.horizontalStart && x < selectedGrid.horizontalStart + selectedGrid.horizontalWord.length)
          } else {
            active = (x === selectedPos.x && y >= selectedGrid.verticalStart && y < selectedGrid.verticalStart + selectedGrid.verticalWord.length)
          }
        }
        if (grid.text) {
          grids.push(
            <Grid
              key={`${x}-${y}`}
              location={{ x: x, y: y }}
              status={{
                active: active,
                selected: selectedPos && x === selectedPos.x && y === selectedPos.y,
                wrong: !!grid.userInput && grid.userInput !== grid.text
              }}
              text={grid.userInput}
              handlePress={this._onGridPress}
            />
          )
        }
      })
    });
    return (
      <TouchableWithoutFeedback onPress={this._onBlankAreaClick}>
        <LinearGradient style={styles.container} colors={['#006e7c', '#57c7d1', '#8fd9d2', '#eebfa1']}>
          <TopLayout
            style={styles.topLayout}
            openProfile={this._openProfile}
            score="10%"
            title="title"/>
          <View style={styles.board}>
            { grids }
          </View>
          <View style={[styles.note]}>
            {
              selectedGrid && <Note
                horizontalNote={selectedGrid.horizontalNote}
                verticalNote={selectedGrid.verticalNote}
                horizonActive={activeDirection}
              />
            }
          </View>
          <BottomLayout
            handleInput={this._handleInput}
            onHintClick={this._onHintClick}
          />
        </LinearGradient>
      </TouchableWithoutFeedback>
    )
  }
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  board: {
    width: config.gridWidth * 10,
    height: config.gridWidth * 10,
  },
  note: {
    position: 'absolute',
    top: 50,
  },
  topLayout: {
    paddingTop: 20,
  }
});

Board.propTypes = {
  selectGrid: PT.func.isRequired,
  loadMission: PT.func.isRequired,
  changeActiveDirection: PT.func.isRequired,
  clearSelected: PT.func.isRequired,
  playMusic: PT.func.isRequired,
  requestHint: PT.func.isRequired,
  inputWord: PT.func.isRequired,
  board: PT.array,
  selectedPos: PT.shape(),
  activeDirection: PT.bool.isRequired,
  backgroundMusic: PT.instanceOf(Sound),
  loadingMusic: PT.bool.isRequired,
  navigation: PT.shape().isRequired,
  missionName: PT.string,
  title: PT.string,
};

Board.defaultProps = {
  board: null,
  selectedPos: null,
  backgroundMusic: null,
  missionName: null,
  title: null,
};

const mapDispatchToProps = (dispatch) => ({
  selectGrid: (x, y) => {
    dispatch(actions.game.selectGrid(x, y));
  },
  loadMission: (name) => {
    dispatch(actions.game.loadMission(name));
  },
  changeActiveDirection: (direction) => {
    dispatch(actions.game.changeActiveDirection(direction));
  },
  clearSelected: () => {
    dispatch(actions.game.clearSelected());
  },
  playMusic: (name) => {
    if (!name) name = config.backgroundMusic;
    dispatch(actions.game.playMusicInit());
    dispatch(actions.game.playMusicDone(name));
  },
  requestHint: (x, y) => {
    dispatch(actions.game.requestHint(x, y));
  },
  inputWord: (positions) => {
    dispatch(actions.game.inputWord(positions));
  }
});

const mapStateToProps = state => ({
  board: state.board,
  selectedPos: state.selectedPos,
  activeDirection: state.activeDirection,
  backgroundMusic: state.backgroundMusic,
  loadingMusic: state.loadingMusic,
  missionName: state.missionName,
  title: state.title,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
