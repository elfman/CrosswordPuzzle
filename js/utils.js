import React, { Component } from 'react';
import {
  AsyncStorage
} from 'react-native';
import RNFS from 'react-native-fs';
import missionFile from './missions.json';

export function parseBoardData(data) {
  const board = new Array(10);
  for (let i = 0; i < 10; i++) {
    board[i] = new Array(10);
    for (let j = 0; j < 10; j++) {
      board[i][j] = {
        position: {x: j, y: i},
        text: null,
        userInput: null,
        horizontalNote: null,
        verticalNote: null,
        selected: false,
        active: false
      }
    }
  }

  data.board.map(word => {
    let x = word.x;
    let y = word.y;
    for (let i = 0; i < word.text.length; i++) {
      if (x > 9 || y > 9) {
        console.error(`error in board json file， x:${x},y:${y}, word:${word.text}, i:${i}`);
        return;
      }
      const grid = board[y][x];
      if (grid.text !== null && grid.text !== word.text[i]) {
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
  board.map((line, y) => {
    line.map((grid, x) => {
      if (grid && grid.userInput) {
        inputState.push({
          x: x,
          y: y,
          input: grid.userInput
        });
      }
    });
  });

  AsyncStorage.setItem(`mission-${name}`, JSON.stringify(inputState)).then((err) => {
    if (err) {
      console.log('error when save mission');
    } else {
      console.log('save success');
    }
    return err;
  });
}

export function loadMission(name) {
  let mission;
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
  let file;
  if (RNFS.MainBundlePath) {
    file = RNFS.readFile(RNFS.MainBundlePath +  `/sessions/${mission.file}`);
  } else {
    file = RNFS.readFileAssets(`sessions/${mission.file}`);
  }

  return file.then(missionInfo => {
    const board = parseBoardData(JSON.parse(missionInfo));
    return AsyncStorage.getItem(`mission-${name}`).then((result) => {
      if (result) {
        let state = JSON.parse(result);
        state.map(obj => {
          board[obj.y][obj.x].userInput = obj.input;
        });
      }
      mission.board = board;
      return mission;
    });
  }).catch(error => console.log('error when reading mission board'));

}
