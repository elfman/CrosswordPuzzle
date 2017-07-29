import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';

import Grid from './Grid';
import Note from './Note';
import BottomLayout from './BottomLayout';
import { parseBoardData } from '../utils';

import BoardInfo from '../../data/board1.json';

function setGridInputText(grid, newInput) {
  if (grid.userInput !== grid.text) {
    grid.userInput = newInput;
  }
}

export default class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectState: null,
      backgroundMusic: null,
      board: null,
      loadingMusic: false,
    };

    this.onGridPress = this.onGridPress.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.onHintClick = this.onHintClick.bind(this);
    this.onBlankAreaClick = this.onBlankAreaClick.bind(this);
  }

  componentDidMount() {
    this.playBackgroundMusic();
    this.initBoard();
  }

  componentWillUnmount() {
    const { backgroundMusic } = this.state;
    backgroundMusic.stop();
    backgroundMusic.release();
  }

  onBlankAreaClick() {
    this.setState({selectState: null});
  }

  onGridPress(x, y) {
    const { selectState, board } = this.state;

    let newState;
    if (selectState && selectState.x === x && selectState.y === y) {
      newState = Object.assign(selectState, {horizontal: !selectState.horizontal});
    } else {
      newState = {
        x: x,
        y: y,
        horizontal: !!(board[y][x].horizontalWord),
      }
    }

    this.setState({selectState: newState});
  }

  onHintClick() {
    const { selectState, board } = this.state;
    if (!selectState) {
      return;
    }
    board[selectState.y][selectState.x].userInput = board[selectState.y][selectState.x].text;
    this.forceUpdate();
  }

  handleInput(input) {
    const { selectState, board } = this.state;
    if (!selectState || !input) {
      return;
    }
    const selectedGrid = board[selectState.y][selectState.x];

    if (input.length === 1) {
      selectedGrid.userInput = input;
    } else if (selectState.horizontal) {
      const y = selectState.y;
      if (input.length === selectedGrid.horizontalWord.length) {
        for (let i = 0; i < selectedGrid.horizontalWord.length; i++) {
          setGridInputText(board[y][selectedGrid.horizontalStart + i], input[i]);
        }
      } else {
        for (let i = 0; i < input.length && board[y][selectState.x + i].horizontalWord; i++) {
          setGridInputText(board[y][selectState.x + i], input[i]);
        }
      }
    } else {
      const x = selectState.x;
      if (input.length === selectedGrid.verticalWord.length) {
        for (let i = 0; i < selectedGrid.verticalWord.length; i++) {
          setGridInputText(board[selectedGrid.verticalStart + i][x], input[i]);
        }
      } else {
        for (let i = 0; i < input.length && board[selectState.y + i][x].verticalWord; i++) {
          setGridInputText(board[selectState.y + i][x], input[i]);
        }
      }
    }
    this.forceUpdate();
  }

  playBackgroundMusic() {
    const { backgroundMusic, loadingMusic} = this.state;
    if (!backgroundMusic && !loadingMusic) {
      this.setState({loadingMusic: true});
      const music = new Sound('background.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          this.setState({loadingMusic: false});
          return;
        }
        music.setVolume(0.8);

        music.setNumberOfLoops(-1);

        music.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors.' + success);
          }
        });

        this.setState({ backgroundMusic: music, loadingMusic: false });
      });
    }
  }

  initBoard() {
    // TODO data from other
    const data = BoardInfo;
    this.setState({board: parseBoardData(data)});
  }

  render() {
    const { board, selectState } = this.state;
    const selectedGrid = selectState && board[selectState.y][selectState.x];
    const grids = [];

    board && board.map((line, y) => {
      line.map((grid, x) => {
        let active = false;
        if (selectState) {
          if (selectState.horizontal) {
            active = (y === selectState.y && x >= selectedGrid.horizontalStart && x < selectedGrid.horizontalStart + selectedGrid.horizontalWord.length)
          } else {
            active = (x === selectState.x && y >= selectedGrid.verticalStart && y < selectedGrid.verticalStart + selectedGrid.verticalWord.length)
          }
        }
        if (grid.text) {
          grids.push(
            <Grid
              key={`${x}-${y}`}
              location={{ x: x, y: y }}
              status={{
                active: active,
                selected: selectState && x === selectState.x && y === selectState.y,
                wrong: !!grid.userInput && grid.userInput !== grid.text
              }}
              text={grid.userInput}
              handlePress={this.onGridPress}
            />
          )
        }
      })
    });
    return (
      <TouchableWithoutFeedback onPress={this.onBlankAreaClick}>
        <LinearGradient colors={['#006e7c', '#57c7d1', '#8fd9d2', '#eebfa1']} style={styles.container}>
          <View style={[styles.board, { left: (Dimensions.get('window').width - 35 * 10) / 2 }]}>
            { grids }
          </View>
          <View style={[styles.note]}>
            {
              selectedGrid && <Note
                horizontalNote={selectedGrid.horizontalNote}
                verticalNote={selectedGrid.verticalNote}
                horizonActive={selectState.horizontal}
              />
            }
          </View>
          <BottomLayout
            style={styles.bottomLayout}
            handleInput={this.handleInput}
            onHintClick={this.onHintClick}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  board: {
    position: 'absolute',
    height: 320,
    bottom: 120,
    left: 15,
  },
  note: {
    position: 'absolute',
    top: 20,
  },
  bottomLayout: {
    width: width,
  }
});
