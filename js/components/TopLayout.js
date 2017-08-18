import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import PT from 'prop-types';

import settingsIcon from '../../resources/images/settings.png';

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
        <View style={styles.button}>
          <TouchableOpacity onPress={openProfile}>
            <Image style={{width: 25, height: 25}} source={settingsIcon}/>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 30,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  score: {
    flex: 0.2,
    marginLeft: 30,
    fontSize: 19,
  },
  title: {
    flex: 0.6,
    fontSize: 18,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  button: {
    flex: 0.2,
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});

export default TopLayout;
