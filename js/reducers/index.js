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
    [a.requestHint]: (state, actions) => {
      let { board } = state;
      const { x, y } = actions.payload;
      if (board[y][x].userInput !== board[y][x].text) {
        board[y][x].userInput = board[y][x].text;
        board = board.slice(0);
      }
      return {
        ...state,
        board: board,
      }
    },
    [a.inputWord]: (state, {payload}) => {
      const grids = payload;
      let {board} = state;
      let changed = false;
      if (grids) {
        grids.map((pos) => {
          const grid = board[pos.y][pos.x];
          if (grid.userInput !== grid.text) {
            grid.userInput = pos.input;
            changed = true;
          }
        });
        if (changed) board = board.slice(0);
      }
      return {
        ...state,
        board: board,
      }
    }
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