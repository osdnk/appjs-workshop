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

const { set, cond, block, eq, add, and, sqrt, Value, spring, or, divide, greaterThan, sub,event, diff, multiply, clockRunning, startClock, stopClock, decay, Clock, lessThan } = Animated

function withBouncyLimits(val, min, max, state) {
  const prev = new Animated.Value(0)
  const limitedVal = new Animated.Value(0)
  const flagWasRunSpring = new Animated.Value(0)
  const springClock = new Clock()
  return block([
    cond(eq(state, State.BEGAN),[
      set(prev, val),
      set(flagWasRunSpring, 0),
      stopClock(springClock)
    ], [
      cond(or(and(eq(state, State.END), or(lessThan(limitedVal, min), greaterThan(limitedVal, max))), flagWasRunSpring),
        [
          set(flagWasRunSpring, 1),
          cond(lessThan(limitedVal, min),
            set(limitedVal, runSpring(springClock, limitedVal, diff(limitedVal), min))
          ),
          cond(greaterThan(limitedVal, max),
            set(limitedVal, runSpring(springClock, limitedVal, diff(limitedVal), max))
          ),
        ],
        [
          set(limitedVal, add(limitedVal, sub(val, prev))),
          cond(and(lessThan(limitedVal, min), lessThan(val, prev)),
            // derivate of sqrt
            [
              // revert
              set(limitedVal, add(limitedVal, sub(prev, val))),
              // and use derivative of sqrt(x)
              set(limitedVal,
                sub(limitedVal,
                  multiply(
                    (divide(1, multiply(2, sqrt(sub(min, sub(limitedVal, sub(prev, val))))))),
                    (sub(prev, val))
                  )
                )
              ),
            ]
          ),
          cond(and(greaterThan(limitedVal, max), greaterThan(val, prev)),
            // derivate of sqrt
            [
              // revert
              set(limitedVal, add(limitedVal, sub(prev, val))),
              // and use derivative of sqrt(x)
              set(limitedVal,
                add(limitedVal,
                  multiply(
                    (divide(1, multiply(2, sqrt(sub(add(limitedVal, sub(val, prev)), max))))),
                    (sub(val, prev))
                  )
                )
              ),
            ]
          ),
          set(prev, val),
        ]
      ),
    ]),
    limitedVal,
  ])
}

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

function withDecaying(drag, state) {
  const valDecayed = new Animated.Value(0)
  const offset = new Animated.Value(0)
  const decayClock = new Clock()
  // since there might be moar than one clock
  const wasStartedFromBegin = new Animated.Value(0)
  return block([
    cond(eq(state, State.END),
      [
        set(valDecayed, runDecay(decayClock, add(drag, offset), diff(drag), wasStartedFromBegin))
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


function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  }

  const config = {
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  }

  return [
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.velocity, velocity),
      set(state.position, value),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]
}


function withLimits(val, min, max, state) {
  const offset = new Animated.Value(0)
  const offsetedVal = add(offset, val)
  return block([
    cond(eq(state, State.BEGAN),[
      cond(lessThan(offsetedVal, min),
        set(offset, sub(min, val))),
      cond(greaterThan(offsetedVal, max),
        set(offset, sub(max, val)))
    ]),
    cond(lessThan(offsetedVal, min), min, cond(greaterThan(offsetedVal, max), max, offsetedVal))
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
        nativeEvent: {
          scale,
          state: scaleState
        }
      },
    ])

    this.X = withBouncyLimits(withDecaying(withPreservingAdditiveOffset(dragX, panState), panState), -100, 100, panState)
    this.Y = withBouncyLimits(withDecaying(withPreservingAdditiveOffset(dragY, panState), panState), -100, 100, panState)
    this.scale = withLimits(withPreservingMultiplicativeOffset(scale, scaleState), 0.1, 2, scaleState)
  }

  panRef = React.createRef();
  pinchRef = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <CliectSays
          text="Hi! Hi! I know you're in hurry for your wife's birthday (best wished btw!)
          but there's one more feature I could find useful. I want component to stop on meeting
          limits but to slow down (e.g. use sqrt of movement) and then slightly move to
          limits on finger released. It should be very easy for you! (deploy tomorrow btw but no pressure).
          Cheers! "
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

