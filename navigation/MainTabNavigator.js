/* eslint-disable react/display-name */
import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import Task0 from '../screens/Task0'
import Task1 from '../screens/Task1'
import Task2 from '../screens/Task2'
import Task3 from '../screens/Task3'
import Task4 from '../screens/Task4'
import Task5 from '../screens/Task5'
import Task6 from '../screens/Task6'

// setInterval(() => {
//   let iters = 1e8, sum = 0;
//   while (iters-- > 0) sum += iters;
// }, 300);

const enhance = (Component, name) => {
  Component.navigationOptions = {
    tabBarLabel: name,
    header: null,
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={
          Platform.OS === 'ios'
            ? `ios-information-circle${focused ? '' : '-outline'}`
            : 'md-information-circle'
        }
      />
    ),
  }

  return Component
}

export default createBottomTabNavigator({
  Task0: enhance(Task0, 'Task 0'),
  Task1: enhance(Task1, 'Task 1'),
  Task2: enhance(Task2, 'Task 2'),
  Task3: enhance(Task3, 'Task 3'),
  Task4: enhance(Task4, 'Task 4'),
  Task5: enhance(Task5, 'Task 5'),
  Task6: enhance(Task6, 'Task 6'),
}, {
  initialRouteName: 'Task0',
})
