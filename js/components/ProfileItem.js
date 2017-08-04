import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import PT from 'prop-types';
import _ from 'lodash';

import arrow from '../../resources/images/arrow.png';

class ProfileItem extends Component {
  render() {
    const { title, rightText, onPress, noBorder } = this.props;
    return (
      <TouchableOpacity onPress={onPress ? onPress : _.noop}>
        <View style={[itemStyles.container, noBorder && itemStyles.noBorder]}>
          <Text style={itemStyles.title}>{title}</Text>
          <View style={itemStyles.right}>
            { rightText && <Text style={itemStyles.rightText}>{rightText}</Text> }
            {onPress && <Image style={itemStyles.arrow} source={arrow}/>}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const itemStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    height: 60,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  right: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: 120,
    marginRight: 10,
  },
  rightText: {
    fontSize: 18,
    color: '#555',
  },
  arrow: {
    marginLeft: 6,
    width: 14,
    height: 18,
    marginTop: 2,
  },
  noBorder: {
    borderBottomWidth: 0,
  }
});

ProfileItem.propTypes = {
  title: PT.string.isRequired,
  rightText: PT.string,
  showArrow: PT.bool,
  onPress: PT.func,
  noBorder: PT.bool,
};

ProfileItem.defaultProps = {
  rightText: null,
  showArrow: false,
  onPress: null,
  noBorder: false,
};

export default ProfileItem;
