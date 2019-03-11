import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandler, DangerZone } from 'expo';
const { Animated } = DangerZone;
// even better https://github.com/kmagiera/react-native-reanimated/blob/master/Example/PanRotateAndZoom/index.js

const { PanGestureHandler, State, PinchGestureHandler } = GestureHandler;
const {
  add,
  cond,
  event,
  eq,
  set,
  multiply
} = Animated;

export default class Task1 extends React.Component {
  static navigationOptions = {
    header: null,
  };

  translateX = new Animated.Value(0);
  translateY = new Animated.Value(0);
  prevX = new Animated.Value(0);
  prevY = new Animated.Value(0);

  onGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: this.translateX,
          translationY: this.translateY,
        },
      },
    ],
  );

  onHandlerStateChange = event([
      {
        nativeEvent: ({ oldState, translationX, translationY }) =>
          cond(eq(oldState, State.ACTIVE),
            [
              set(this.prevX, add(this.prevX, translationX)),
              set(this.prevY, add(this.prevY, translationY)),
              set(this.translateX, 0),
              set(this.translateY, 0)
            ]
          )
      }
    ])


  baseScale = new Animated.Value(1);
  pinchScale = new Animated.Value(1);

  lastScale = 1;
  onPinchGestureEvent = event(
    [{ nativeEvent: { scale: this.pinchScale } }]
  );

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
  ]);

  pinch = React.createRef();
  pan = React.createRef();

  render() {
    return (
      <View style={styles.container}>
        <PinchGestureHandler
          ref={this.pinch}
          simultaneousHandlers={this.ref}
          onGestureEvent={this.onPinchGestureEvent}
          onHandlerStateChange={this.onPinchHandlerStateChange}
        >
          <Animated.View>
            <PanGestureHandler
              ref={this.pan}
              simultaneousHandlers={this.pinch}
              onGestureEvent={this.onGestureEvent}
              onHandlerStateChange={this.onHandlerStateChange}
            >
              <Animated.View
                style={[
                  styles.box,
                  {
                    transform: [
                      /*Does order matter?*/
                      { scale: multiply(this.baseScale, this.pinchScale) },
                      { translateX: add(this.translateX, this.prevX) },
                      { translateY: add(this.translateY, this.prevY) },
                    ],
                  }
                ]}
              >
                <Text>
                  Rewrite using reanimated
                </Text>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  box: {
    width: 100,
    backgroundColor: 'yellow',
    height: 100,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
