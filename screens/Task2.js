import React from 'react'
import { Animated, StyleSheet, View, } from 'react-native'
import { GestureHandler } from 'expo'
import { CliectSays } from './ClientSays'

const { PanGestureHandler, State, PinchGestureHandler, RotationGestureHandler } = GestureHandler


export default class Task1 extends React.Component {
  translateX = new Animated.Value(0);
  translateY = new Animated.Value(0);
  prevX = 0;
  prevY = 0;

  onPanGestureEvent = Animated.event(
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

  onPanHandlerStateChange = ({ nativeEvent: { oldState, translationX, translationY } }) => {
    if (oldState === State.ACTIVE) {
      this.prevX += translationX
      this.prevY += translationY
      this.translateX.setValue(0)
      this.translateY.setValue(0)
      this.translateX.setOffset(this.prevX)
      this.translateY.setOffset(this.prevY)
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <CliectSays
          text="Wow! Thanks. I think I need also to have this box resizeable.
          I mean I want to be able to pinch to zoom.
          And maybe rotating with a gesture? "
        />
        <PanGestureHandler
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.onPanHandlerStateChange}
          avgTouches
        >

          <Animated.View
            style={StyleSheet.absoluteFill}
          >
            <PinchGestureHandler>
              <Animated.View
                style={StyleSheet.absoluteFill}
              >
                <RotationGestureHandler>
                  <Animated.View
                    style={[StyleSheet.absoluteFill, styles.container]}
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
                  />
                  </Animated.View>
                </RotationGestureHandler>
              </Animated.View>
            </PinchGestureHandler>
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
  },
})
