import * as React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Ttlock } from 'react-native-ttlock';


const optionsData = [

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
  "Clear all passageModes",
  "Reset ekey",
  "Rest lock",
]


const optionClick = (option: String, lockData: String) => {
  if (option === "Control lock") {
    Ttlock.controlLock(Ttlock.ControlEnum.lock, "lockData", ()=>{

    }, (code: Number,message: String)=>{
      console.log(option,"失败：", code, message);
    })
  }else if (option === "Rest lock") {
    Ttlock.resetLock(lockData,()=>{

    }, (code: Number,message: String)=>{
      console.log(option,"失败：", code, message);
    })
  } else if (option === "Reset ekey") {

  }
}

const LockPage = (props) => {
  const { route } = props;
  const { scanLockMap, lockData } = route.params;
  const renderItem = ({ item }) => {
    return (

      <TouchableHighlight
        onPress={() => {
          optionClick(item, lockData);
        }}>
        <View>
          <Text >{item}</Text>
        </View>
      </TouchableHighlight>

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