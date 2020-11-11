import * as React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import {Ttlock} from 'react-native-ttlock';
import store from './Store'



const ScanLockPage = ({ navigation }) => {
  store.scanLockDataList = []

  Ttlock.startScan((data) => {
    let isContain = false;
    let isInitStateChange = false;
    store.scanLockDataList.forEach(oldData => {
      if(oldData.lockMac === data.lockMac){
        isContain = true;
        if(oldData.isInited !== data.isInited){
          oldData.isInited = data.isInited;
          isInitStateChange = true;
        }
      }
    });
    if(isContain === false){
      console.log("name:",data.lockName, "   mac:",data.lockMac,"   isInited:",data.isInited);
      store.scanLockDataList.push(data);
    }

    if(isContain === false || isInitStateChange){
      store.scanLockDataList.sort((data1,data2) => {
        return data1.isInited > data2.isInited;
      })
    }
    

  });

  const renderItem = ({ item }) => (
    <Item item={item} />
  );

  return (
      <FlatList
        data={store.scanLockDataList}
        renderItem={renderItem}
        keyExtractor={item => item.lockMac}
      />
  );
}

const Item = ({ item }) => {
  let titleColor = item.isInited ? "lightgray" :  "black" ;
  let title = item.isInited ? "" : "init"  

  return (
    <View style={styles.item}>
      <Text style={{color:titleColor, fontSize:20, lineHeight:40}} >{item.lockName}</Text>
      <Button title={title} color="blue"  onPress={()=>{console.log('')}}>
      </Button>
    </View>
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