import React from 'react';
import {
  AsyncStorage
} from 'react-native';
import RNFS from 'react-native-fs';
import missionsData from './missions.json';

export function parseBoardData(data) {
  const board = new Array(10);
  for (let i = 0; i < 10; i++) {
    board[i] = new Array(10);
  }

  data.map(word => {
    let x = word.x;
    let y = word.y;
    for (let i = 0; i < word.text.length; i++) {
      if (x > 9 || y > 9) {
        console.error(`error in board json file， x:${x},y:${y}, word:${word.text}, i:${i}`);
        return;
      }
      if (!board[y][x]) {
        board[y][x] = {};
      }
      const grid = board[y][x];
      if (grid.text && grid.text !== word.text[i]) {
        console.error(`error in board json file， x:${x},y:${y}, word:${word.text}, i:${i}`);
        return;
      } else {
        grid.text = word.text[i];
      }
      if (word.direction) {
        if (grid.horizontalNote) {
          throw `conflict horizontal note in ${JSON.stringify(word)}`
        }
        grid.horizontalNote = word.note;
        grid.horizontalStart = x - i;
        grid.horizontalWord = word.text;
        x++;
      } else {
        if (grid.verticalNote) {
          throw `conflict vertical note in ${JSON.stringify(word)}`;
        }
        grid.verticalNote = word.note;
        grid.verticalStart = y - i;
        grid.verticalWord = word.text;
        y++;
      }
    }
  });

  return board;
}

export function saveMission(name, board) {
  let inputState = [];
  let correct = 0;
  let total = 0;
  board.map((line, y) => {
    line.map((grid, x) => {
      if (grid) total++;

      if (grid && grid.userInput) {
        inputState.push({
          x: x,
          y: y,
          input: grid.userInput
        });
        if (grid.userInput === grid.text) correct++;
      }
    });
  });

  AsyncStorage.setItem(`mission-${name}`, JSON.stringify({
    correct: correct,
    total: total,
    inputState: inputState
  })).then((err) => {
    if (err) {
      console.log('error when save mission', err);
    }
    return err;
  });
}

export function resetMission(name) {
  if (name) {
    AsyncStorage.removeItem(`mission-${name}`);
  }
}

export function loadMission(name) {
  let mission;
  const missionFile = getMissionsData();
  if (name) {
    const tmp = missionFile.missions.filter(mission => mission.name === name);
    if (tmp.length === 0) {
      console.log(`can not find mission ${name}`);
      return Promise.resolve(null);
    } else {
      mission = tmp[0];
    }
  } else {
    mission = missionFile.missions[0];
  }

  const board = parseBoardData(mission.boardSource);
  return AsyncStorage.getItem(`mission-${name}`).then(res => JSON.parse(res)).then((result) => {
    if (result && result.inputState) {
      let state = result.inputState;
      state.map(obj => {
        board[obj.y][obj.x].userInput = obj.input;
      });
    }
    mission.board = board;
    return mission;
  });
}

export function getMissionsData() {
  return missionsData;
}
