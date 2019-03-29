import React from 'react'
import { StyleSheet, View, } from 'react-native'
import { DangerZone, GestureHandler } from 'expo'
import { CliectSays } from './ClientSays'
import { MonoText } from '../components/StyledText'

const { Animated } = DangerZone

const { PanGestureHandler, State, PinchGestureHandler } = GestureHandler
const {
  add,
  cond,
  event,
  eq,
  set,
  multiply,
  block
} = Animated

export default class Task1 extends React.Component {
  translateX = new Animated.Value(0);
  translateY = new Animated.Value(0);
  prevX = new Animated.Value(0);
  prevY = new Animated.Value(0);
  panState = new Animated.Value(0);

  onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: this.translateX,
          translationY: this.translateY,
          state: this.panState,
        },
      },
    ],
  )

  transX =
    block([
      cond(
        eq(this.panState, State.END),
        [
          set(
            this.prevX,
            add(this.translateX, this.prevX),
          ),
          set(this.translateX, 0)
        ]),
      add(this.translateX, this.prevX)
    ])

  transY =
    block([
      cond(
        eq(this.panState, State.END),
        [
          set(
            this.prevY,
            add(this.translateY, this.prevY),
          ),
          set(this.translateY, 0)
        ]),
      add(this.translateY, this.prevY)
    ])


  baseScale = new Animated.Value(1);
  pinchScale = new Animated.Value(1);
  onPinchGestureEvent = event(
    [{ nativeEvent: { scale: this.pinchScale } }]
  )

  onPinchHandlerStateChange = event([
    {
      nativeEvent: ({ oldState, scale }) =>
        cond(eq(oldState, State.ACTIVE),
          [
            set(this.baseScale, multiply(this.baseScale, scale)),
            set(this.pinchScale, 1),
          ]
        )
    }
  ])



  pinch = React.createRef();
  pan = React.createRef();

  render() {
    const size = multiply(this.baseScale, this.pinchScale, 100)
    return (
      <View style={styles.container}>
        <CliectSays
          text="Cool! Let's skip rotating and stay with panning and pinching.
          Can make it possible to zoom box but leave text without scaling?
          Could we use reanimated for this case?"
        />
        <PinchGestureHandler
          ref={this.pinch}
          simultaneousHandlers={this.ref}
          onGestureEvent={this.onPinchGestureEvent}
          onHandlerStateChange={this.onPinchHandlerStateChange}
        >
          <Animated.View
            style={StyleSheet.absoluteFill}
          >
            <PanGestureHandler
              ref={this.pan}
              simultaneousHandlers={this.pinch}
              onGestureEvent={this.onPanEvent}
              onHandlerStateChange={this.onPanEvent}
            >
              <Animated.View
                style={[StyleSheet.absoluteFill, styles.container]}
              >
                <Animated.View
                  style={[
                    styles.box,
                    {
                      width: size,
                      height: size
                    },
                    {
                      transform: [
                        { translateX: this.transX },
                        { translateY: this.transY },
                      ],
                    }
                  ]}
                >
                  <MonoText>
                    Thinking inside the box
                  </MonoText>
                </Animated.View>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
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
