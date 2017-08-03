import { handleActions } from 'redux-actions';
import actions from '../actions/index';


function create() {
  const a = actions.game;

  return handleActions({
    [a.selectGrid]: (state, actions) => ({
      ...state,
      selectedPos: actions.payload,
    }),
    [a.changeActiveDirection]: (state, actions) => ({
      ...state,
      activeDirection: actions.payload,
    }),
    [a.loadSession]: (state, actions) => ({
        ...state,
        sessionName: actions.payload.name,
        title: actions.payload.title,
        board: actions.payload.board,
    }),
    [a.clearSelected]: (state, actions) => ({
      ...state,
      selectedPos: null,
    }),
    [a.playMusicInit]: (state) => ({
      ...state,
      loadingMusic: true,
    }),
    [a.playMusicDone]: (state, actions) => ({
      ...state,
      loadingMusic: false,
      backgroundMusicName: actions.payload.name,
      backgroundMusic: actions.payload.music,
    }),
  }, {
    activeDirection: true,
    loadingMusic: false,
    backgroundMusicName: null,
    backgroundMusic: null,
    selectedPos: null,
    board: null,
    title: null,
    session: null,
  })
}

export default create();