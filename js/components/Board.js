import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
      selectedGrid: null,
    };
    this.initBoard();

    this.onGridPress = this.onGridPress.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.onHintClick = this.onHintClick.bind(this);
  }

  onGridPress(x, y) {
    const old = this.state.selectState;
    const board = this.state.board;
    let oldGrid;

    if (old) {
      oldGrid = board[old.y][old.x];
    }
    this.state.selectState = {
      x: x,
      y: y
    };
    const selectedGrid = board[y][x];
    const activeHorizontal = () => {
      for (let i = 0; i < selectedGrid.horizontalWord.length; i++) {
        board[y][selectedGrid.horizontalStart + i].active = true;
      }
      this.state.selectState.horizontal = true;
    };
    const activeVertical = () => {
      for (let i = 0; i < selectedGrid.verticalWord.length; i++) {
        board[selectedGrid.verticalStart + i][x].active = true;
      }
      this.state.selectState.horizontal = false;
    };

    if (oldGrid) {
      // clear old state
      oldGrid.selected = false;
      if (old.horizontal) {
        for (let i = 0; i < oldGrid.horizontalWord.length; i++) {
          board[old.y][oldGrid.horizontalStart + i].active = false;
        }
      } else {
        for (let i = 0; i < oldGrid.verticalWord.length; i++) {
          board[oldGrid.verticalStart + i][old.x].active = false;
        }
      }
    }
    if (old && old.x === x && old.y === y) {
      if (old.horizontal) {
        if (oldGrid.verticalWord) {
          activeVertical();
        } else {
          activeHorizontal();
        }
      } else {
        if (oldGrid.horizontalWord) {
          activeHorizontal();
        } else {
          activeVertical();
        }
      }
    } else {
      if (selectedGrid.horizontalWord) {
        activeHorizontal();
      } else {
        activeVertical();
      }
    }
    selectedGrid.selected = true;
    this.forceUpdate();
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

  initBoard() {
    // TODO data from other
    const data = BoardInfo;
    this.state.board = parseBoardData(data);
  }

  render() {
    const { board, selectState } = this.state;
    const selectedGrid = selectState && board[selectState.y][selectState.x];
    const grids = [];

    board.map((line, y) => {
      line.map((grid, x) => {
        if (grid.text) {
          grids.push(
            <Grid
              key={`${x}-${y}`}
              location={{x: x, y: y}}
              status={{
                active: !!grid.active,
                selected: !!grid.selected,
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
      <LinearGradient colors={['#006e7c', '#57c7d1', '#8fd9d2', '#eebfa1']} style={styles.container}>
        <View style={[styles.note]}>
        {
          selectedGrid && <Note
            horizontalNote={selectedGrid.horizontalNote}
            verticalNote={selectedGrid.verticalNote}
            horizonActive={selectState.horizontal}
          />
        }
        </View>
        <View style={[styles.board, {left: (Dimensions.get('window').width - 35*10)/2}]}>
          { grids }
        </View>
        <BottomLayout
          style={styles.bottomLayout}
          handleInput={this.handleInput}
          onHintClick={this.onHintClick}
        />
      </LinearGradient>
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
