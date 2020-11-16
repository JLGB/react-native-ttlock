import * as React from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import store from './store'

const MainPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          navigation.navigate("ScanLockPage",{store: store});
          store.startScanLock();
        }}>
        <Text style={styles.touchButtonText}>Lock</Text>
      </TouchableHighlight>

      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={() => {
          store.startScanGateway();
          navigation.navigate("ScanGatewayPage",{store: store});
        }}>
        <Text style={styles.touchButtonText}>Gateway</Text>
      </TouchableHighlight>
      
  
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "column",
    justifyContent: "center"
  },


  touchButton: {
    backgroundColor: "white",
    marginTop: 80,
    marginHorizontal: 100,
    height: 150,

    borderRadius: 20,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  touchButtonText: {
    color: '#333333',
    textAlign: 'center',
  }
});

export default MainPage;