import React from 'react'
import { Animated, StyleSheet, View, } from 'react-native'
import { GestureHandler } from 'expo'
import { CliectSays } from './ClientSays'

const  { PanGestureHandler, State } = GestureHandler
export default class Task1 extends React.Component {
  translateX = new Animated.Value(0)
  translateY = new Animated.Value(0)
  prevX = 0;
  prevY = 0;

  onGestureEvent=Animated.event(
    [
      {
        nativeEvent: {
          translationX: this.translateX,
          translationY: this.translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  onHandlerStateChange = ({ nativeEvent:
    { oldState, translationX, translationY }
  }) => {
    if (oldState === State.ACTIVE) {
      this.prevX += translationX
      this.prevY += translationY
      this.translateX.setValue(0)
      this.translateY.setValue(0)
      this.translateX.setOffset(this.prevX)
      this.translateY.setOffset(this.prevY)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CliectSays
          text="Hello friend! Could you see the yellow box below?
          It will be some super component some day but now I want to make
          it draggable. Could you help me?"
        />
        <PanGestureHandler
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  { translateX: this.translateX },
                  { translateY: this.translateY },
                ],
              }
            ]}
          >
          </Animated.View>
        </PanGestureHandler>
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
