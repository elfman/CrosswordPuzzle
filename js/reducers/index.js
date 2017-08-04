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
    [a.loadMission]: (state, actions) => ({
        ...state,
        selectedPos: null,
        missionName: actions.payload.name,
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
    [a.playMusicDone]: (state, actions) => {
      if (state.backgroundMusic) {
        state.backgroundMusic.stop();
        state.backgroundMusic.release();
      }
      return {
        ...state,
        loadingMusic: false,
        backgroundMusicName: actions.payload.name,
        backgroundMusic: actions.payload.music,
      };
    },
  }, {
    activeDirection: true,
    loadingMusic: false,
    backgroundMusicName: null,
    backgroundMusic: null,
    selectedPos: null,
    board: null,
    title: null,
    missionName: null,
  })
}

export default create();