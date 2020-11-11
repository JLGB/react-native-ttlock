import * as React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Ttlock } from 'react-native-ttlock';
import store from './Store'


const optionsData = [
  "Rest lock",
  "Reset ekey",
  "Control lock",
  "Create custom passcode",
  "Modify passcode",
  "Delete passcode",
  "Reset passcode",
  "Get lock switch state",
  "Add card",
  "Modify card validity period",
  "Delete card",
  "Clear all cards",
  "Add fingerprint",
  "Modify fingerprint validity period",
  "Delete fingerprint",
  "Clear all fingerprints",
  "SetLock time",
  "Get lock time",
  "Get lock operate record",
  "Get lock automatic locking periodic time",
  "Set lock automatic locking periodic time",
  "Set lock remote unlock switch state",
  "Get lock config",
  "Set lock config",
  "Add passage mode",
  "Clear all passageModes"
]


const LockPage = ({ navigation }) => {
 
  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text >{item}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={optionsData}
      renderItem={renderItem}
      keyExtractor={item => item}
    />
  );
}
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   marginTop: StatusBar.currentHeight || 0,
  // },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },

});

export default LockPage;