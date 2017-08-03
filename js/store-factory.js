
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';

import reducer from './reducers';

export default function factory() {
  const enhancer = applyMiddleware(promiseMiddleware);
  const store = createStore(reducer, {
    activeDirection: true,
    loadingMusic: false,
    backgroundMusicName: null,
    backgroundMusic: null,
    selectedPos: null,
    board: null,
    title: null,
    session: null,
  }, enhancer);

  return store;
}