import React from 'react'
import { Animated, StyleSheet, View, } from 'react-native'
import { GestureHandler } from 'expo'
import { CliectSays } from './ClientSays'

const  { PanGestureHandler, State } = GestureHandler
export default class Task1 extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <CliectSays
          text="Hello friend! Could you see the yellow box below?
          It will be some super component some day but now I want to make
          it draggable. Could you help me?"
        />
        <View style={styles.box}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    width: 100,
    backgroundColor: 'yellow',
    height: 100,
  }
})
