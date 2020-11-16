import React, {useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Ttlock } from 'react-native-ttlock';
import type {ScanLockMap} from './types'

const initLock = (data: ScanLockMap, navigation) => {
  let object = {
    lockMac: data.lockMac,
    lockVersion: data.lockVersion
  }
  Ttlock.initLock(object, (lockData: String) => {
    Ttlock.stopScan();
    navigation.navigate("LockPage",{scanLockMap: data, lockData: lockData});
  }, (code: Number,message: String) => {
    console.log("失败：", code, message);
  })
}

const ScanLockPage = (props) => {

  // console.log(props);
  const { navigation } = props;

  const [dataList] = useState([]);
  
  
  Ttlock.startScan((data: ScanLockMap) => {
    // console.log(data);
    let isContainData = false;
    let isInitStateChanged = false;
    dataList.forEach((oldData: ScanLockMap) => {
      if (oldData.lockMac === data.lockMac) {
        isContainData = true;
        if (oldData.isInited !== data.isInited) {
          oldData.isInited = data.isInited;
          isInitStateChanged = true;
        }
      }
    });
    if (isContainData === false) {
      dataList.push(data)
      // setDataList(dataList)
    }

    if (isContainData === false || isInitStateChanged) {
      dataList.sort((data1, data2) => {
        return data1.isInited > data2.isInited;
      })
    }
    
  });

  const renderItem = ({ item }) => {
    let titleColor = item.isInited ? "lightgray" : "black";
    let title = item.isInited ? "" : "init"

    return (
      <View style={styles.item}>
        <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.lockName}</Text>
        <Button title={title} color="blue" onPress={() => { initLock(item, navigation) }}>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={dataList}
      renderItem={renderItem}
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

export default ScanLockPage;