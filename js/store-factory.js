
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';

import reducer from './reducers';
import {saveMission} from './utils';

export default function factory() {
  const enhancer = applyMiddleware(promiseMiddleware);
  const initState = {
    activeDirection: true,
    loadingMusic: false,
    backgroundMusicName: null,
    backgroundMusic: null,
    selectedPos: null,
    board: null,
    title: null,
    missionName: null,
  };
  const store = createStore(reducer, initState, enhancer);

  let currentBoard = initState.board;
  store.subscribe(() => {
    let prevBoard = currentBoard;
    currentBoard = store.getState().board;
    if (currentBoard !== prevBoard) {
      saveMission(store.getState().missionName, currentBoard);
    }
  });

  return store;
}