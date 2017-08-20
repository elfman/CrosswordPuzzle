import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import PT from 'prop-types';

export default class Grid extends Component {
  constructor(props) {
    super(props);

    this._handlePress = this._handlePress.bind(this);
  }

  _handlePress() {
    const { handlePress, location: { x, y } } = this.props;
    handlePress(x, y);
  }

  render() {
    const { location, status, text, config } = this.props;
    return (
      <TouchableOpacity
        style={[styles.grid, {
          width: config.gridSize,
          height: config.gridSize,
          backgroundColor: status.selected ? config.selectedColor
            : (status.active ? config.activeColor : config.gridBackgroundColor)
        }, {
          top: location.y * config.gridSize,
          left: location.x * config.gridSize,
        }
        ]}
        onPress={this._handlePress}
      >
        <Text style={[styles.text, status.wrong && styles.wrong]}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  grid: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.2,
    borderStyle: 'solid',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  wrong: {
    color: 'red',
  }
});

Grid.propTypes = {
  status: PT.shape().isRequired,
  location: PT.shape().isRequired,
  handlePress: PT.func.isRequired,
  text: PT.string,
  config: PT.shape().isRequired,
};

Grid.defaultProps = {
  text: null,
};