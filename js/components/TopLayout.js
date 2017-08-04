import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import PT from 'prop-types';

class TopLayout extends Component {
  render() {
    const { score, title, openProfile } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.score}>
          {score}
        </Text>
        <Text style={styles.title}>
          {title}
        </Text>
        <TouchableOpacity style={styles.button} onPress={openProfile}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

TopLayout.propTypes = {
  score: PT.string,
  title: PT.string,
  openProfile: PT.func.isRequired,
};

TopLayout.defaultProps = {
  score: null,
  title: null,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },
  score: {
    width: 60,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  button: {
    width: 80,
  }
});

export default TopLayout;
