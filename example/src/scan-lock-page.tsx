import React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { Ttlock, ScanLockModal } from 'react-native-ttlock';
import { observer } from 'mobx-react';
import Toast from 'react-native-root-toast';

const initLock = (scanLockModal: ScanLockModal, navigation: any) => {
  showToast("Init ...");

  let object = {
    lockMac: scanLockModal.lockMac,
    lockVersion: scanLockModal.lockVersion
  }
  Ttlock.initLock(object, (lockData) => {
    Ttlock.stopScan();
    navigation.navigate("LockPage", { scanLockModal: scanLockModal, lockData: lockData });
    hidenToast();
  }, (errorCode, errorDesc) => {
    showToast("errorCode："+ errorCode + " errorDesc:"+errorDesc);
  })
}

const renderItem = (item: ScanLockModal, navigation: any) => {
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

const ScanLockPage = (props: { navigation: any; route: any; }) => {
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

var toast: Toast | undefined;
function showToast(text: string){
  if(toast !== undefined){
    Toast.hide(toast);
    toast = undefined;
  }
  toast = Toast.show(text, {
    position: Toast.positions.CENTER,
    duration: Toast.durations.LONG,
  });
}

function hidenToast(){
  if(toast !== undefined){
    Toast.hide(toast);
    toast = undefined;
  }
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