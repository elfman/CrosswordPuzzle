
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';

import reducer from './reducers';
import {saveMission} from './utils';
import config from './config';
import actions from './actions';

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
    config: config,
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


  // let lastConfig = initState.config;
  // store.subscribe(() => {
  //   let prevConfig = lastConfig;
  //   lastConfig = store.getState().config;
  //   if (!prevConfig.playBackgroundMusic && lastConfig.playBackgroundMusic) {
  //     if (store.getState().backgroundMusic) {
  //       store.getState().backgroundMusic.play();
  //     } else {
  //       store.dispatch(actions.game.playMusicInit());
  //       store.dispatch(actions.game.playMusicDone(config.backgroundMusic));
  //     }
  //   } else if (prevConfig.playBackgroundMusic && !lastConfig.playBackgroundMusic) {
  //     store.getState().backgroundMusic.stop();
  //   }
  // });

  return store;
}