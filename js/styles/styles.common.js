import {
  Dimensions,
} from 'react-native';

import config from '../config/config'

const { width } = Dimensions.get('window');

const gameStyles = {
  container: {
    flex: 1,
    width: width,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  board: {
    marginBottom: 20,
    width: config.gridWidth * 10,
    height: config.gridWidth * 10,
  },
  note: {
    position: 'absolute',
    top: 55,
  },
  topLayout: {
    width: width,
    position: 'absolute',
    top: 0,
    zIndex: 3,
  }
};

export default {
  gameStyles
};