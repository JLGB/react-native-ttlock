import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScanLockPage from './ScanLockPage';
import MainPage from "./MainPage"
import LockPage from './LockPage';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainPage">
        <Stack.Screen  name="MainPage" component={MainPage} options={{title:"Ttlock Demo"}} />
        <Stack.Screen name="ScanLockPage" component={ScanLockPage} options={{title:"Lock"}} />
        <Stack.Screen name="LockPage" component={LockPage} options={{title:"Lock"}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}