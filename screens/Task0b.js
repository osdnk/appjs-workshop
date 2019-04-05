import React from 'react'
import { Animated, StyleSheet, View, ScrollView, Image } from 'react-native'
import { GestureHandler } from 'expo'
import { CliectSays } from './ClientSays'
import { MonoText } from '../components/StyledText'

const AniamtedImage = props => (
  <Animated.Image
    source={require('../assets/images/doggo.jpeg')}
    resizeMode='cover'
    style={[
      {
        width: 200,
        height: 200,
        alignSelf: 'center',
        borderRadius: 100
      },
      props.style
    ]}
  />
)

const Lorem = () => (
  <View
    style={{
      height: 500
    }}
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
  </View>
)

const Header = () => (
  <View
    style={{
      width: '100%',
      height: 40,
      backgroundColor: 'red'
    }}
  >
    <MonoText>
      Header
    </MonoText>
  </View>
)

const  { PanGestureHandler, State } = GestureHandler
export default class Task0 extends React.Component {
  trans = new Animated.Value(0)
  int = this.trans.interpolate({
    inputRange: [0, 100, 110],
    outputRange: [0, 50, 50],
  })
  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          scrollEventThrottle={1}
        >
          <Header/>
          <Lorem/>
          <Header/>
          <Lorem/>
          <Header/>
          <Lorem/>

        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 16
  },
  box: {
    width: 100,
    backgroundColor: 'yellow',
    height: 100,
  }
})
