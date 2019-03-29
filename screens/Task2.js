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

  baseScale = new Animated.Value(1);
  pinchScale = new Animated.Value(1);
  scale = Animated.multiply(this.baseScale, this.pinchScale);
  lastScale = 1;
  onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: this.pinchScale } }],
    { useNativeDriver: true }
  );

  onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastScale *= event.nativeEvent.scale
      this.baseScale.setValue(this.lastScale)
      this.pinchScale.setValue(1)
    }
  };

  baseRotation = new Animated.Value(0);
  zoomRotation = new Animated.Value(0);
  rotation = Animated.add(this.baseRotation, this.zoomRotation);
  lastRotation = 0;
  onRotationGestureEvent = Animated.event(
    [{ nativeEvent: { rotation: this.zoomRotation } }],
    { useNativeDriver: true }
  );

  rotationString = this.rotation.interpolate({
    inputRange: [-100, 100],
    outputRange: ['-100rad', '100rad'],
  });

  onRotationHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this.lastRotation += event.nativeEvent.rotation
      this.baseRotation.setValue(this.lastRotation)
      this.zoomRotation.setValue(0)
    }
  };

  pinch = React.createRef();
  pan = React.createRef();
  rotate = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <CliectSays
          text="Wow! Thanks. I think I need also to have this box resizeable.
          I mean I want to be able to pinch to zoom.
          And maybe rotating with gesture? "
        />
        <PanGestureHandler
          ref={this.pan}
          simultaneousHandlers={[this.pinch, this.rotate]}
          onGestureEvent={this.onPanGestureEvent}
          onHandlerStateChange={this.onPanHandlerStateChange}
          avgTouches
        >

          <Animated.View
            style={StyleSheet.absoluteFill}
          >
            <PinchGestureHandler
              ref={this.pinch}
              simultaneousHandlers={[this.rotate, this.pinch]}
              onGestureEvent={this.onPinchGestureEvent}
              onHandlerStateChange={this.onPinchHandlerStateChange}>
              <Animated.View
                style={StyleSheet.absoluteFill}
              >
                <RotationGestureHandler
                  ref={this.rotate}
                  simultaneousHandlers={[this.pan, this.pinch]}
                  onGestureEvent={this.onRotationGestureEvent}
                  onHandlerStateChange={this.onRotationHandlerStateChange}>
                  <Animated.View
                    style={[StyleSheet.absoluteFill, styles.container]}
                  >
                  <Animated.View
                    style={[
                      styles.box,
                      {
                        transform: [
                          { rotate: this.rotationString },
                          { translateX: this.translateX },
                          { translateY: this.translateY },
                          { scale: this.scale },
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
