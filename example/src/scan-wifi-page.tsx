import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { TtGateway } from 'react-native-ttlock';




const ScanWifiPage = (props) => {
  const { navigation, route } = props;
  const [dataList, setDataList] = useState([]);

  const gotoInitGateway = (item) => {
    console.log("gotoInitGateway:",item);
    navigation.navigate("GatewayPage", { wifi: item.wifi });
  }


  TtGateway.getNearbyWifi((list) => {
    list.forEach(data => {
      dataList.push(data)
    });
    // setDataList(dataList.concat(list))
  }, () => {

  }, (errorCode, errorMessage) => {
    console.log("getNearbyWifi fail");
  })
  const renderItem = ({ item }) => {
    let titleColor = "black";
    let title = "Init"

    return (
      <View style={styles.item}>
        <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.wifi}</Text>
        <Button title={title} color="blue" onPress={() => { gotoInitGateway(item) }}>
        </Button>
      </View>
    );
  }

  return (
    <View>
      <FlatList
      data={dataList}
      renderItem={renderItem}
      keyExtractor={item => item.gatewayMac}
    />
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

export default ScanWifiPage;