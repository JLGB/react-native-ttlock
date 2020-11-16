import React, {useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { TtGateway } from 'react-native-ttlock';




const ScanWifiPage = (props) => {
  const { navigation, route } = props;
  const [dataList, setDataList] = useState([]);
  const {gatewayName} = route.params;
  
  
  const gotoInitGateway = (item, navigation) => {
    navigation.navigate("GatewayPage",{gatewayName: gatewayName, wifi: item.wifi});
  }

TtGateway.getNearbyWifi((list)=>{
  list.forEach((data) => {
    dataList.push(data);
    console.log("wifi:",data.wifi);
  });
  setDataList(dataList);
},()=>{

}, (errorCode, errorMessage) => {
  console.log("getNearbyWifi fail");
})

  TtGateway.startScan((data) => {
    let isContainData = false;
    dataList.forEach((oldData) => {
      if (oldData.gatewayMac === data.gatewayMac) {
        isContainData = true;
      }
    });
    if (isContainData === false) {
      dataList.push(data);
      setDataList(dataList.slice());
    }
  });

  const renderItem = ({ item }) => {
    let titleColor = "black";
    let title = "Init"

    return (
      <View style={styles.item}>
        <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.wifi}</Text>
        <Button title={title} color="blue" onPress={() => { gotoInitGateway(item, navigation) }}>
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={dataList}
      renderItem={renderItem}
      keyExtractor={item => item.gatewayMac}
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

export default ScanWifiPage;