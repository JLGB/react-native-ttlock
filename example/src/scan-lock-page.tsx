import React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Ttlock } from 'react-native-ttlock';
import { observer } from 'mobx-react';

const initLock = (data, navigation) => {
  let object = {
    lockMac: data.lockMac,
    lockVersion: data.lockVersion
  }
  Ttlock.initLock(object, (lockData) => {
    Ttlock.stopScan();
    navigation.navigate("LockPage", { scanLockMap: data, lockData: lockData });
  }, (code, message) => {
    console.log("失败：", code, message);
  })
}

const renderItem = (item, navigation) => {
  let titleColor = item.isInited ? "lightgray" : "black";
  let title = item.isInited ? "" : "Init"
  return (
    <View style={styles.item}>
      <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.lockName}</Text>
      <Button title={title} color="blue" onPress={() => { initLock(item, navigation)}}>
      </Button>
    </View>
  );
}

const ScanLockPage = (props) => {
  const { navigation, route } = props;
  const { store } = route.params;
  return (
    <FlatList
      data={store.lockList}
      renderItem={({item})=>renderItem(item,navigation)}
      keyExtractor={item => item.lockMac}
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

export default observer(ScanLockPage)