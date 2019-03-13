import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from 'expo'
import { MonoText } from '../components/StyledText'

export class CliectSays extends React.Component {
  state = {
    text: ''
  };

  onPress = () => {
    if (this.props.text.length === this.state.text.length) {
      this.setState({
        text: ''
      })
      return
    }
    this.timer = setInterval(() => {
      if (this.props.text.length === this.state.text.length) {
        clearInterval(this.timer)
        return
      }
      this.setState(prev => ({
        text: this.props.text.substring(0, prev.text.length + 1)
      }))
    }, 30)
  };

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 32,
          flexDirection: 'row',
          paddingHorizontal: 16,
          width: '100%',
        }}
        disabled={!!this.state.text.length && this.props.text.length !== this.state.text.length}
        onPress={this.onPress}
      >
        <Icon.Feather name="user" size={32} color="green"/>
        {!!this.state.text.length && <View style={{
          backgroundColor: '#d0f0ff',
          borderRadius: 12,
          marginLeft: 12,
          marginRight: 36,
          padding: 12,
        }}>
          <MonoText>
            {this.state.text}
          </MonoText>
        </View>
        }
      </TouchableOpacity>
    )
  }
}
