import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Note extends Component {
  render() {
    return (
      <View style={styles.container}>
        {
          this.props.horizontalNote && <Text>
            横：{this.props.horizontalNote}
          </Text>
        }
        {
          this.props.verticalNote && <Text>
            纵：{this.props.verticalNote}
          </Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#28bf65',
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
  }
});
