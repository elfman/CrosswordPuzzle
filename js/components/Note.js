import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import PT from 'prop-types';

export default class Note extends Component {
  render() {
    const { horizontalNote, verticalNote, horizonActive } = this.props;
    return (
      <View style={styles.container}>
        {
          horizontalNote && <Text
            style={[styles.text, horizonActive && styles.active]}
          >
            横：{horizontalNote}
          </Text>
        }
        {
          verticalNote && <Text
            style={[styles.text, !horizonActive && styles.active, horizontalNote && styles.lineGap]}
          >
            纵：{verticalNote}
          </Text>
        }
      </View>
    )
  }
}

Note.PropTypes = {
  horizontalNote: PT.string,
  verticalNote: PT.string,
  horizonActive: PT.bool,
};
Note.defaultProps = {
  horizontalNote: null,
  verticalNote: null,
  horizonActive: false,
};

const styles = StyleSheet.create({
  container: {
    width: 340,
    backgroundColor: '#aedc43',
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 10,
    borderStyle: 'solid',
    borderWidth: 0.1,
    borderColor: 'black',
    borderRadius: 3,
  },
  text: {
    color: '#808080',
    fontSize: 16,
  },
  active: {
    color: 'black'
  },
  lineGap: {
    marginTop: 5,
  }
});
