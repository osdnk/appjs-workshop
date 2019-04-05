import React from 'react'
import { Animated, StyleSheet, View, ScrollView } from 'react-native'
import { GestureHandler } from 'expo'
import { CliectSays } from './ClientSays'
import { MonoText } from '../components/StyledText'

const  { PanGestureHandler, State } = GestureHandler
export default class Task0 extends React.Component {
  state = {
    trans: new Animated.Value(0)
  }
  render() {
    return (
      <View style={styles.container}>
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  y: this.state.trans
                }
              },
            }
          ],
          { useNativeDriver: true }
          )}
        >
          <MonoText>
            At vero eos et accusamus et iusto odio dignissimos
            ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi
            sint occaecati cupiditate non provident, similique
            sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga. Et harum quidem
            rerum facilis est et expedita distinctio. Nam libero
            tempore, cum soluta nobis est eligendi optio cumque
            nihil impedit quo minus id quod maxime placeat facere
            possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis
            debitis aut rerum necessitatibus saepe eveniet ut et
            voluptates repudiandae sint et molestiae non recusandae.
            Itaque earum rerum hic tenetur a sapiente delectus, ut aut
            reiciendis voluptatibus maiores alias consequatur aut
            perferendis doloribus asperiores repellat.
            At vero eos et accusamus et iusto odio dignissimos
            ducimus qui blanditiis praesentium voluptatum deleniti
            atque corrupti quos dolores et quas molestias excepturi
            sint occaecati cupiditate non provident, similique
            sunt in culpa qui officia deserunt mollitia animi,
            id est laborum et dolorum fuga. Et harum quidem
            rerum facilis est et expedita distinctio. Nam libero
            tempore, cum soluta nobis est eligendi optio cumque
            nihil impedit quo minus id quod maxime placeat facere
            possimus, omnis voluptas assumenda est, omnis dolor
            repellendus. Temporibus autem quibusdam et aut officiis
            debitis aut rerum necessitatibus saepe eveniet ut et
            voluptates repudiandae sint et molestiae non recusandae.
            Itaque earum rerum hic tenetur a sapiente delectus, ut aut
            reiciendis voluptatibus maiores alias consequatur aut
            perferendis doloribus asperiores repellat.
          </MonoText>
        </Animated.ScrollView>
        <Animated.View style={[styles.box, { transform: [{ translateX: this.state.trans }]}]}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    backgroundColor: 'yellow',
    height: 100,
  }
})
