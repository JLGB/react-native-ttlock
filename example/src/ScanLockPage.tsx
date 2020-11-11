import * as React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Ttlock } from 'react-native-ttlock';
import store from './Store'

const ScanLockPage = ({ navigation }) => {

  startScanLock();

  const renderItem = ({ item }) => {
    let titleColor = item.isInited ? "lightgray" : "black";
    let title = item.isInited ? "" : "init"

    return (
      <View style={styles.item}>
        <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.lockName}</Text>
        <Button title={title} color="blue" onPress={() => { initLock(item) }}>
        </Button>
      </View>
    );
  }



  const initLock = (data) => {
    let object = {
      lockMac: data.lockMac,
      lockVersion: data.lockVersion
    }
    Ttlock.initLock(object, (lockData) => {
      store.scanLockDataList = []
      Ttlock.stopScan();
      navigation.navigate("LockPage");
    }, (error) => {
      console.log("失败：", error);
    })
  }

  return (
    <FlatList
      data={store.scanLockDataList}
      renderItem={renderItem}
      keyExtractor={item => item.lockMac}
    />
  );
}


function startScanLock() {
  store.scanLockDataList = []
  Ttlock.startScan((data) => {
    // console.log(data);
    let isContainData = false;
    let isInitStateChanged = false;
    store.scanLockDataList.forEach(oldData => {
      if (oldData.lockMac === data.lockMac) {
        isContainData = true;
        if (oldData.isInited !== data.isInited) {
          oldData.isInited = data.isInited;
          isInitStateChanged = true;
        }
      }
    });
    if (isContainData === false) {
      store.scanLockDataList.push(data);
    }

    if (isContainData === false || isInitStateChanged) {
      store.scanLockDataList.sort((data1, data2) => {
        return data1.isInited > data2.isInited;
      })
    }
  });
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

export default ScanLockPage;