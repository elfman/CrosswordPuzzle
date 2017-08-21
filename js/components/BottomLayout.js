import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
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
    // if (Platform.OS === 'android') {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.hint} onPress={this.props.onHintClick}>
            <Text>提示</Text>
          </TouchableOpacity>
          <TextInput
            ref="input"
            style={styles.input}
            onChangeText={text => this.setState({ text })}
            onSubmitEditing={this.onInputDone}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            placeholder={'输入答案后提交'}
          />
          <TouchableOpacity style={styles.done} onPress={this.onInputDone}>
            <Text>提交</Text>
          </TouchableOpacity>
        </View>
      )
    // } else {
    //   return (
    //     <KeyboardAvoidingView
    //       style={{ width: Dimensions.get('window').width }}
    //       contentContainerStyle={styles.container}
    //       behavior="padding"
    //       keyboardVerticalOffset={0}>
    //       <TouchableOpacity style={styles.hint} onPress={this.props.onHintClick}>
    //         <Text>提示</Text>
    //       </TouchableOpacity>
    //       <TextInput
    //         ref="input"
    //         style={styles.input}
    //         onChangeText={text => this.setState({ text })}
    //         onSubmitEditing={this.onInputDone}
    //         autoCorrect={false}
    //         underlineColorAndroid="transparent"
    //         placeholder={'输入答案后提交'}
    //       />
    //       <TouchableOpacity style={styles.done} onPress={this.onInputDone}>
    //         <Text>提交</Text>
    //       </TouchableOpacity>
    //     </KeyboardAvoidingView>
    //   )
    // }
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 34,
    backgroundColor: 'white',
    marginTop: 5,
    paddingLeft: 17,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 16,
    borderRadius: 17,
  },
  done: {
    width: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
