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

import menuIcon from '../../resources/images/menu.png';

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
            <Image style={{width: 20, height: 20}} source={menuIcon}/>
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
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 50,
    paddingTop: 20,
    justifyContent: 'space-between',
    backgroundColor: 'transparent'
  },
  score: {
    width: 60,
    marginLeft: 30,
    fontSize: 17,
  },
  title: {
    flex: 1,
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  button: {
    width: 60,
    marginRight: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});

export default TopLayout;
