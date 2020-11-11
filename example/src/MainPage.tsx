import * as React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';



const MainPage = (props) => {

  const renderItem = ({ item }) => (
    <Item item={item} />
  );

  return (
      <View>
        <Button title="Lock"></Button>
        <Button title="Gateway"></Button>
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

export default MainPage;