import React, {useEffect, useState} from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import { TtGateway } from 'react-native-ttlock';



const ScanGatewayPage = (props) => {
  const { navigation } = props;
  const [dataList, setDataList] = useState([]);

  const connectGateway = (item) => {
    TtGateway.connect(item.gatewayMac, ()=> {
      navigation.navigate("ScanWifiPage",{gatewayName: item.gatewayName});
    }, (errorCode,errorMessage) => {
      console.log("Connect fail");
    } )
  }
  
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
    let title = "connect"

    return (
      <View style={styles.item}>
        <Text style={{ color: titleColor, fontSize: 20, lineHeight: 40 }} >{item.gatewayName}</Text>
        <Button title={title} color="blue" onPress={() => { connectGateway(item) }}>
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

export default ScanGatewayPage;