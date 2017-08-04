import { createActions } from 'redux-actions';
import { AsyncStorage } from 'react-native';
import { loadMission } from '../utils';
import Sound from 'react-native-sound';
import config from '../config/config'
import _ from 'lodash';

let loadingMusic = false;

function playMusicDone(name) {
  if (!name) {
    name = config.backgroundMusic;
  }
  return new Promise((resolve, reject) => {
    const music = new Sound(name, Sound.MAIN_BUNDLE, (error) => {
      loadingMusic = false;
      if (error) {
        console.log('failed to load the sound', error);
        reject('failed to load the sound');
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

      resolve({ name: name, music: music });
    });
  });
}

function _loadMission(missionName) {
  return loadMission(missionName).then((session) => {
    AsyncStorage.setItem('lastPlayedSession', session.name);
    return ({
      name: session.name,
      title: session.title,
      board: session.board
    })
  });
}


export default createActions({
  GAME: {
    LOAD_MISSION: _loadMission,
    SELECT_GRID: (x, y) => ({ x: x, y: y }),
    CHANGE_ACTIVE_DIRECTION: direction => !!direction,
    CLEAR_SELECTED: _.noop,
    PLAY_MUSIC_INIT: _.noop,
    PLAY_MUSIC_DONE: playMusicDone,
  }
})
