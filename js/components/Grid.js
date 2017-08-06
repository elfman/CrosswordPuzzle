import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import config from '../config/config';
import PT from 'prop-types';

const gridWidth = 35;
const gridHeight = 35;

export default class Grid extends Component {
  constructor(props) {
    super(props);

    this._handlePress = this._handlePress.bind(this);
  }
  _handlePress() {
    const {handlePress, location: {x, y}} = this.props;
    handlePress(x, y);
  }
  render() {
    const { location, status, text} = this.props;
    return (
        <TouchableOpacity
          style={[styles.grid,
            status.active && styles.active,
            status.selected && styles.selected, {
              top: location.y * gridHeight,
              left: location.x * gridWidth,
            }
          ]}
          onPress={this._handlePress}
        >
          <Text style={[styles.text, status.wrong && styles.wrong]} >{text}</Text>
        </TouchableOpacity>
    )
  }
}

Grid.propTypes = {
  status: PT.shape().isRequired,
  location: PT.shape().isRequired,
  handlePress: PT.func.isRequired,
  text: PT.string,
};

Grid.defaultProps = {
  text: null,
};

const styles = StyleSheet.create({
  grid: {
    position: 'absolute',
    width: gridWidth,
    height: gridHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: config.borderColor,
    borderWidth: 0.2,
    borderStyle: 'solid',
    backgroundColor: config.gridBackgroundColor,
  },
  active: {
    backgroundColor: config.activeColor
  },
  selected: {
    backgroundColor: config.selectedColor
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  wrong: {
    color: 'red',
  }
});
