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

const { set, cond, block, eq, add, Value, divide, greaterThan, sub,event, diff, multiply, clockRunning, startClock, stopClock, decay, Clock, lessThan } = Animated

function runDecay(clock, value, velocity, wasStartedFromBegin) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = { deceleration: 0.99 }

  return [
    cond(clockRunning(clock), 0, [
      cond(wasStartedFromBegin, 0, [
        set(wasStartedFromBegin, 1),
        set(state.finished, 0),
        set(state.velocity, velocity),
        set(state.position, value),
        set(state.time, 0),
        startClock(clock),
      ]),
    ]),
    // set(state.position, value),
    decay(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]
}

function withPreservingMultiplicativeOffset (val, state) {
  const prev = new Animated.Value(1)
  const valWithPreservedOffset = new Animated.Value(1)
  return block([
    cond(eq(state, State.BEGAN), [
      set(prev, 1)
    ], [
      set(valWithPreservedOffset, multiply(valWithPreservedOffset, divide(val, prev))),
      set(prev, val),
    ]),
    valWithPreservedOffset
  ])
}

function withPreservingAdditiveOffset(drag, state) {
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

function withDecaying(drag, state, velocity) {
  const valDecayed = new Animated.Value(0)
  const offset = new Animated.Value(0)
  const decayClock = new Clock()
  // since there might be moar than one clock
  const wasStartedFromBegin = new Animated.Value(0)
  return block([
    cond(eq(state, State.END),
      [
        set(valDecayed, runDecay(decayClock, add(drag, offset), velocity, wasStartedFromBegin))
      ],
      [
        stopClock(decayClock),
        cond(eq(state, State.BEGAN), [
          set(wasStartedFromBegin, 0),
          set(offset, add(sub(valDecayed, drag)))
        ]),
        set(valDecayed, add(drag, offset))

      ],
    ),
    valDecayed,
  ])
}


export default class Example extends Component {
  constructor(props) {
    super(props)
    const dragX = new Value(0)
    const dragY = new Value(0)
    const scale = new Value(1)
    const panState = new Value(0)
    const scaleState = new Value(0)
    const velocityX = new Value(0)
    const velocityY = new Value(0)


    this.handlePan = event([
      {
        nativeEvent: ({
          translationX: dragX,
          translationY: dragY,
          state: panState,
          velocityY,
          velocityX
        })
      },
    ])

    this.handleZoom = event([
      {
        nativeEvent: {
          scale,
          state: scaleState
        }
      },
    ])

    this.X = withDecaying(withPreservingAdditiveOffset(dragX, panState), panState, velocityX)
    this.Y = withDecaying(withPreservingAdditiveOffset(dragY, panState), panState, velocityY)
    this.scale = withPreservingMultiplicativeOffset(scale, scaleState)
  }

  panRef = React.createRef();
  pinchRef = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <CliectSays
          text="Great, one moar thing I suppose before release tomorrow.
          I once more made some tweaks in code before release.
          I could imagine a situation when the user throws logo outside the screen.
          Or makes it too small and hardly invisible. I want to preserve it with some limits.
          Do you have some ideas? Btw release tomorrow but no pressure, did I said?"
        />
        <PanGestureHandler
          ref={this.panRef}
          simultaneousHandlers={[this.pinchRef]}
          onGestureEvent={this.handlePan}
          onHandlerStateChange={this.handlePan}>
          <Animated.View>
            <PinchGestureHandler
              ref={this.pinchRef}
              simultaneousHandlers={[this.panRef]}
              onGestureEvent={this.handleZoom}
              onHandlerStateChange={this.handleZoom}>

              <Animated.Image
                resizeMode="contain"
                style={[
                  styles.box,
                  {
                    transform: [
                      { translateX: this.X },
                      { translateY: this.Y },
                      { scale: this.scale },
                    ],
                  },
                ]}
                source={require('./react-hexagon.png')}
              />
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

