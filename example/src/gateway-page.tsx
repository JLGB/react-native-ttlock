import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, Button } from 'react-native';
import { TtGateway } from 'react-native-ttlock';
import Config from './config'



const GatewayPage = (props) => {
  const { navigation, route } = props;
  const { wifi, gatewayName } = route.params;
  const [wifiPassword, setWifiPassword] = useState();


  const editWifiPassword = (text) => {
    setWifiPassword(wifiPassword);
  }

  const initGateway = () => {
    let object = {
      SSID: wifi,
      wifiPwd: wifiPassword,
      gatewayName: gatewayName,
      uid: Config.ttlockUid,
      userPwd: Config.ttlockLoginPassword
    }
    TtGateway.initGateway(object, ()=>{
      console.log("gateway init success");
    }, (errorCode, errorMessage) => {
      console.log("gateway init fail");
    })
  }

  return (
    <View>
      <Text>Wifi: {wifi}</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={text => editWifiPassword(text)}
        placeholder="Please input the wifi password"
        value={value}
      />
      <TouchableHighlight
        style={[styles.touchButton]}
        onPress={initGateway}>
        <Text style={styles.touchButtonText}>Gateway</Text>
      </TouchableHighlight>
    </View>
  );
}




const styles = StyleSheet.create({
  touchButton: {
    backgroundColor: "white",
    marginTop: 80,
    marginHorizontal: 100,
    height: 40,

    borderRadius: 6,
    borderColor: "lightgray",
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
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

export default GatewayPage;