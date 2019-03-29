import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { DangerZone, GestureHandler } from 'expo'
import { CliectSays } from './ClientSays'

const { Animated } = DangerZone
const {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} = GestureHandler

const { set, cond, block, eq, add, Value, sub,event, diff, multiply, clockRunning, startClock, stopClock, decay, Clock } = Animated

function withPreservingOffset(drag, state) {
  const prev = new Animated.Value(0)
  const valWithPreservedOffset = new Animated.Value(0)
  return block([
    cond(eq(state, State.BEGAN), [
      set(prev, 0)
    ], [
      set(valWithPreservedOffset, add(valWithPreservedOffset, sub(drag, prev))),
      set(prev, drag),
    ]),
    valWithPreservedOffset
  ])
}

export default class Example extends Component {
  constructor(props) {
    super(props)
    this.Y = new Value(0)
    this.R = new Value(0)
    this.Z = new Value(1)
    const prevZ = new Value(1)
    const dragX = new Value(0)
    const dragY = new Value(0)
    const panState = new Value(0)


    this.handlePan = event([
      {
        nativeEvent: ({
          translationX: dragX,
          translationY: dragY,
          state: panState
        })
      },
    ])

    this.handleZoom = event([
      {
        nativeEvent: ({ scale: z, state }) =>
          block([
            cond(eq(state, State.ACTIVE), set(this.Z, multiply(z, prevZ))),
            cond(eq(state, State.END), [set(prevZ, this.Z)]),
          ]),
      },
    ])

    this.X = withPreservingOffset(dragX, panState)
    this.Y = withPreservingOffset(dragY, panState)
  }

  panRef = React.createRef();
  pinchRef = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <CliectSays
          text="Hey, do you know who am I? I'm your nightmare.
          I'm a client who helps you writing code! I've changed everything you have done.
          I made this React logo draggable and zoomable but I think it's not very
          natural to make it stop immediately as only we drop the finger.
          Could we make it stops slowly with friction?"
        />
        <PanGestureHandler
          avgTouches
          ref={this.panRef}
          simultaneousHandlers={[this.pinchRef]}
          onGestureEvent={this.handlePan}
          onHandlerStateChange={this.handlePan}>
          <Animated.View
              style={StyleSheet.absoluteFill}
          >
            <PinchGestureHandler
              ref={this.pinchRef}
              simultaneousHandlers={[this.panRef]}
              onGestureEvent={this.handleZoom}
              onHandlerStateChange={this.handleZoom}>
              <Animated.View
                style={[StyleSheet.absoluteFill, styles.container]}
              >

              <Animated.Image
                resizeMode="contain"
                style={[
                  styles.box,
                  {
                    transform: [
                      { translateX: this.X },
                      { translateY: this.Y },
                      { scale: this.Z },
                    ],
                  },
                ]}
                source={require('./react-hexagon.png')}
              />
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
    )
  }
}

const IMAGE_SIZE = 200

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
})

