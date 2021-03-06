import React, { Component } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  AsyncStorage,
  AppState,
  Platform,
  Dimensions,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import PT from 'prop-types';
import Sound from 'react-native-sound';
import KeepAwake from 'react-native-keep-awake';

import Grid from '../components/Grid';
import Note from '../components/Note';
import BottomLayout from '../components/BottomLayout';
import TopLayout from '../components/TopLayout';
import { saveMission, getMissionsData } from '../utils';
import actions from '../actions';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appState: AppState.currentState,
      gameProgress: '',
      alertNext: true,
    };

    this._onGridPress = this._onGridPress.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._onHintClick = this._onHintClick.bind(this);
    this._onBlankAreaClick = this._onBlankAreaClick.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this._openProfile = this._openProfile.bind(this);
    this._computeGameProgress = this._computeGameProgress.bind(this);
  }


  _saveMission() {
    const { missionName, board} = this.props;
    saveMission(missionName, board);
  }

  _handleAppStateChange(nextAppState) {
    const { appState } = this.state;
    const { backgroundMusic, playMusic, loadingMusic, config } = this.props;
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
    const { loadMission } = this.props;
    AsyncStorage.getItem('lastPlayedMission').then(result => {
      loadMission(result);
    });
  }

  componentDidMount() {
    const { playMusic, loadingMusic, backgroundMusic, config } = this.props;
    AppState.addEventListener('change', this._handleAppStateChange);
    AsyncStorage.getItem('playBackgroundMusic').then((value) => {
      if (value !== 'false' && !loadingMusic) {
        if (backgroundMusic) {
          backgroundMusic.play();
        } else {
          playMusic(config.backgroundMusicName);
        }
      }
    })
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

  componentWillReceiveProps(nextProps) {
    const { board, missionName } = this.props;

    let {correct, total} = this._computeGameProgress(nextProps.board);
    this.setState({
      gameProgress: (total === 0 && ' ') || `${correct}/${total}`,
    });

    if (nextProps.missionName !== missionName) {
      this.setState({
        alertNext: true,
      });
    } else if (nextProps.board !== board) {
      if (total > 0 && correct === total && this.state.alertNext) {
        Alert.alert('提示', '你已完成这一关卡，是否前往下一关卡？', [
          {text: '否', style: 'cancel', onPress: () => {
            this.setState({
              alertNext: false,
            });
          }},
          {text: '是', onPress: () => {
            this._loadNextMission().done();
          }}
        ])
      }
    }
  }

  async _loadNextMission() {
    const { loadMission } = this.props;
    AsyncStorage.getItem('lastPlayedMission').then(async (name) => {
      const missionsList = getMissionsData().missions;
      if (!name) {
        loadMission(missionsList[0].name);
        return;
      }
      let i;
      for (i = 0; i < missionsList.length; i++) {
        if (missionsList[i].name === name) {
          break;
        }
      }
      for (i = ((i+1) % missionsList.length); missionsList[i].name !== name; i = ((i+1) % missionsList.length)) {
        try {
          const progress = JSON.parse(await AsyncStorage.getItem(`mission-${missionsList[i].name}`));
          if (!progress || progress.correct < progress.total) {
            loadMission(missionsList[i].name);
            return;
          }
        } catch (e) {
          console.log(e);
        }
      }
      Alert.alert('提示', '恭喜您已完成全部关卡！');
    });
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
        for (let i = 0; i < input.length && board[y][selectedPos.x + i]; i++) {
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
        for (let i = 0; i < input.length && board[selectedPos.y + i][x]; i++) {
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

  _computeGameProgress(board) {
    let total = 0;
    let correct = 0;
    board && board.map(line => {
      line.map(grid => {
        total++;
        if (grid.userInput === grid.text) correct++;
      })
    });
    return {correct: correct, total: total};
  }

  render() {
    const { board, selectedPos, activeDirection, title, config } = this.props;
    const { gameProgress } = this.state;
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
              config={config}
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
          <View
            style={styles.topLayout}>
            <TopLayout
              openProfile={this._openProfile}
              score={gameProgress}
              title={title}/>
          </View>
          <View style={[styles.board, {width: config.gridSize * 10, height: config.gridSize * 10}]}>
            { grids }
          </View>
          <View style={styles.note}>
            {
              selectedGrid && <Note
                horizontalNote={selectedGrid.horizontalNote}
                verticalNote={selectedGrid.verticalNote}
                horizonActive={activeDirection}
              />
            }
          </View>
          <KeyboardAvoidingView
            style={styles.bottomLayout}
            behavior={Platform.OS === 'ios' ? 'position' : null}
            contentContainerStyle={styles.bottomLayout}
            keyboardVerticalOffset={0}
          >
            <BottomLayout
              handleInput={this._handleInput}
              onHintClick={this._onHintClick}
            />
          </KeyboardAvoidingView>
          <KeepAwake/>
        </LinearGradient>
      </TouchableWithoutFeedback>
    )
  }
}

const { width, height } = Dimensions.get('window');

const styles = {
  container: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  board: {
    marginTop: 60,
  },
  note: {
    position: 'absolute',
    top: 55,
  },
  bottomLayout: {
    width: width,
    height: 44,
    position: 'absolute',
    bottom: 0,
    zIndex: 3,
  },
  topLayout: {
    width: width,
    height: 30,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
  }
};



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
  config: PT.shape().isRequired,
};

Board.defaultProps = {
  board: null,
  selectedPos: null,
  backgroundMusic: null,
  missionName: null,
  title: null,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
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
  config: state.config,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
