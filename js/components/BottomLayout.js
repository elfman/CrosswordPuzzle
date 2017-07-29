import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';

export default class BottomLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: null
    };
    this.onInputDone = this.onInputDone.bind(this);
  }
  onInputDone() {
    this.props.handleInput(this.state.text);
    this.refs.input.clear();
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.hint} onPress={this.props.onHintClick}>
          <Text>提示</Text>
        </TouchableOpacity>
        <TextInput
          ref="input"
          style={styles.input}
          onChangeText={text => this.setState({text})}
          onSubmitEditing={this.onInputDone}
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity style={styles.done} onPress={this.onInputDone}>
          <Text>Done</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#999',
    height: 44,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  hint: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 34,
    backgroundColor: 'white',
    marginTop: 5,
    paddingLeft: 17,
    fontSize: 14,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
  },
  done: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
