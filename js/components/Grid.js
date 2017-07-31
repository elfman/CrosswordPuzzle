import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import config from '../config/config';

const gridWidth = 35;
const gridHeight = 35;

export default class Grid extends Component {
  render() {
    const handlePress = () => {
      this.props.handlePress(this.props.location.x, this.props.location.y);
    };
    return (
        <TouchableOpacity
          style={[styles.grid,
            this.props.status.active && styles.active,
            this.props.status.selected && styles.selected, {
              top: this.props.location.y * gridHeight,
              left: this.props.location.x * gridWidth,
            }
          ]}
          onPress={handlePress}
        >
          <Text style={[styles.text, this.props.status.wrong && styles.wrong]} >{this.props.text}</Text>
        </TouchableOpacity>
    )
  }
}

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
