import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { GestureHandler, DangerZone } from 'expo';
const { Animated } = DangerZone;
const {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} = GestureHandler

const { set, cond, block, eq, add, spring, and, Value, call, or, divide, sqrt, greaterThan, sub,event, diff, multiply, debug, clockRunning, startClock, stopClock, decay, Clock, lessThan } = Animated;

function runDecay(clock, value, velocity, wasStartedFromBegin) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = { deceleration: 0.99 };

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
  ];
}


function runSpring(clock, value, velocity, dest) {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    damping: 7,
    mass: 1,
    stiffness: 121.6,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
    toValue: new Value(0),
  };

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
  ];
}

export default class Example extends Component {
  constructor(props) {
    super(props);

    this.Y = new Value(0);
    this.R = new Value(0);
    this.Z = new Value(1);
    const prevX = new Value(0);
    const prevY = new Value(0);
    const prevZ = new Value(1);
    const decayClockX = new Clock();
    const decayClockY = new Clock();

    const dragX = new Value(0);
    const dragY = new Value(0);
    const scale = new Value(1);
    const panState = new Value(0);
    const scaleState = new Value(0);


    this.handlePan = event([
      {
        nativeEvent: ({
          translationX: dragX,
          translationY: dragY,
          state: panState
        })
      },
    ]);

    this.handleZoom = event([
      {
        nativeEvent: {
          scale,
          state: scaleState
        }
      },
    ]);

    const withPreservingMultiplicativeOffset = (val, state) => {
      const prev = new Animated.Value(1);
      const valWithPreservedOffset = new Animated.Value(1);
      return block([
        cond(eq(state, State.BEGAN), [
          set(prev, 1)
        ], [
          set(valWithPreservedOffset, multiply(valWithPreservedOffset, divide(val, prev))),
          set(prev, val),
        ]),
        valWithPreservedOffset
      ]);
    }

    const withPreservingAdditiveOffset = (drag, state) => {
      const prev = new Animated.Value(0);
      const valWithPreservedOffset = new Animated.Value(0);
      return block([
        cond(eq(state, State.BEGAN), [
          set(prev, 0)
        ], [
          set(valWithPreservedOffset, add(valWithPreservedOffset, sub(drag, prev))),
          set(prev, drag),
        ]),
        valWithPreservedOffset
      ]);
    }

    const withDecaying = (drag, state) => {
      const valDecayed = new Animated.Value(0);
      const offset = new Animated.Value(0);
      const decayClock = new Clock();
      const wasStartedFromBegin = new Animated.Value(0);
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


    const withBouncy = condition => (val, bound, state) => {
      const offset = new Animated.Value(0)
      const offsetedVal = add(offset, val)
      return block([
        cond(and(eq(state, State.BEGAN), condition(offsetedVal, bound)),[
          set(offset, sub(bound, val)),
        ]),
        cond(condition(offsetedVal, bound), bound, offsetedVal)
      ])
    }

    const withBouncyMin = withBouncy(lessThan)
    const withBouncyMax = withBouncy(greaterThan)

    const withLimits = (val, min, max, state) => {
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

    const withEnhancedLimits = (val, min, max, state) => {
      const offset = new Animated.Value(0)
      const prev = new Animated.Value(0)
      const offsetedVal = add(offset, val)
      const limitedVal = new Animated.Value(0)
      const bouncyVal = new Animated.Value(0)
      const flagWasRunSping = new Animated.Value(0);
      const springClock = new Clock()
      return block([
        cond(eq(state, State.BEGAN),[
          set(prev, val),
          set(flagWasRunSping, 0),
          stopClock(springClock)
        ], [
          cond(or(and(eq(state, State.END), or(lessThan(limitedVal, min), greaterThan(limitedVal, max))), flagWasRunSping),
            [
              set(flagWasRunSping, 1),
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
             /* cond(greaterThan(limitedVal, max),
                set(bouncyVal, min)
              ),*/
              set(prev, val),
            ]
          ),
        ]),
        limitedVal,
      ])
    }


    this.X = withEnhancedLimits(withDecaying(withPreservingAdditiveOffset(dragX, panState), panState), -100, 100, panState)
    this.Y = withEnhancedLimits(withDecaying(withPreservingAdditiveOffset(dragY, panState), panState), -100, 100, panState)
    this.Z = withLimits(withPreservingMultiplicativeOffset(scale, scaleState), 0.1, 2, scaleState)

  }

  panRef = React.createRef();
  pinchRef = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Make dacays
        </Text>
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
                          { scale: this.Z },
                        ],
                      },
                    ]}
                    source={require('./react-hexagon.png')}
                  />


            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const IMAGE_SIZE = 200;

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
});

