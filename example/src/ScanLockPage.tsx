import * as React from 'react';
import { View, FlatList, StyleSheet, Text, Button } from 'react-native';
import {Ttlock} from 'react-native-ttlock';
import store from './Store'



const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    lockName: 'First Item',
    isInited: true
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    lockName: 'Second Item',
    isInited: false
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    lockName: 'Third Item',
    isInited: false
  },
];

const Item = ({ item }) => {

  let titleColor = item.isInited ? "black" : "lightgray"
  let title = item.isInited ? "init" : ""

  return (
    <View style={styles.item}>
      <Text style={{color:titleColor, fontSize:20, lineHeight:40}} >{item.lockName}</Text>
      <Button title={title} color="blue"  onClick={()=>{console.log('')}}>
      </Button>
    </View>
  );
}

const ScanLockPage = (props) => {

  const renderItem = ({ item }) => (
    <Item item={item} />
  );

  return (
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
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