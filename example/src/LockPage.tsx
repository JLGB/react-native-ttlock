import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Ttlock } from 'react-native-ttlock';

const optionsData = [
  "Unlock/Lock",
  "Get lock time",
  "Set lock time",
  "Get lock operate record",
  "Create custom passcode 1122",
  "Modify passcode 1122 -> 2233",
  "Delete passcode 2233",
  "Reset passcode",
  "Get lock switch state",
  "Add card",
  "Modify card validity period",
  "Delete card",
  "Clear all cards",
  "Add fingerprint",
  "Modify fingerprint validity period",
  "Delete fingerprint",
  "Clear all fingerprints",
  "Get lock automatic locking periodic time",
  "Set lock automatic locking periodic time",
  "Set lock remote unlock switch state",
  "Get lock config",
  "Set lock config",
  "Add passage mode",
  "Clear all passageModes",
  "Reset ekey",
  "Rest lock",
]

const successCallback = (info: Object)=>{
      console.log("success:",info);
}
const progressCallback = (info: Object)=>{
  console.log("progress:",info);
}

const failedCallback = (errorCode: Number,errorMessage: String)=>{
  console.log("errorCode:",errorCode, "    errorMessage:",errorMessage);
}

var cardumber: String = "";
var fingerprintNumber: String = "";


const optionClick = (option: String, lockData: String) => {

  if (option === "Unlock/Lock") 
  {
    Ttlock.controlLock(Ttlock.ControlEnum.unlock, lockData, (data: Object)=>{
      successCallback(data);
    }, failedCallback)
  }

  if (option === "Get lock time") 
  {
    Ttlock.getLockTime(lockData, (lockTimestamp: Number)=>{
      successCallback("lockTimestamp:" + lockTimestamp);
    },failedCallback);
  }
  else if (option === "Set lock time") 
  {
    let timestamp = new Date().getTime();
    Ttlock.setLockTime(timestamp,lockData,successCallback,failedCallback);
  } 
  else if (option === "Get lock operate record") 
  {
    Ttlock.getLockOperateRecord(Ttlock.LockRecord.latest,lockData,successCallback,failedCallback);
  } 
  else if (option === "Create custom passcode 1122") 
  {
    // passcode valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.createCustomPasscode("1122",startDate,endDate,lockData,successCallback,failedCallback);
  } 
  else if (option === "Modify passcode 1122 -> 2233") 
  {

    // passcode valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.modifyPasscode("1122","2233",startDate,endDate,lockData,successCallback,failedCallback);
  } 

  else if (option === "Delete passcode 2233") 
  {
    Ttlock.deletePasscode("2233",lockData,successCallback,failedCallback);
  } 

  else if (option === "Reset passcode") 
  {
    Ttlock.resetPasscode(lockData,(lockDataNew: String)=>{
      //important: upload lockDataNew to ttlock server. 
      successCallback(lockDataNew);
    },failedCallback);
  } 

  else if (option === "Get lock switch state") 
  {
    Ttlock.getLockSwitchState(lockData,(state:Number)=>{
      let message = "state: "+state;
      if(state === 0){
        message += "  desc: Lock"
      }else if(state === 0){
        message += "  desc: Unlock"
      }
      successCallback(message);
    },failedCallback);
  } 
  else if (option === "Add card") 
  {
    // card valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addCard(null,startDate,endDate,lockData,progressCallback,(number: String)=> {
      cardumber = number;
      successCallback("cardumber:" + cardumber);
    },failedCallback);
  } 
  else if (option === "Modify card validity period") 
  {
    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyCardValidityPeriod(cardumber,null,startDate,endDate,lockData,successCallback,failedCallback);
  }
  else if (option === "Delete card") 
  {
   Ttlock.deleteCard(cardumber,lockData,successCallback,failedCallback);
  } 
  else if (option === "Clear all cards") 
  {
   Ttlock.clearAllCards(lockData,successCallback,failedCallback);
  } 




  else if (option === "Add fingerprint") 
  {
    // card valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addFingerprint([],startDate,endDate,lockData,progressCallback,(number: String)=> {
      fingerprintNumber = number;
      successCallback("fingerprintNumber:" + cardumber);
    },failedCallback);
  } 
  else if (option === "Modify fingerprint validity period") 
  {
    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyFingerprintValidityPeriod(fingerprintNumber,[],startDate,endDate,lockData,successCallback,failedCallback);
  }
  else if (option === "Delete fingerprint") 
  {
   Ttlock.deleteFingerprint(fingerprintNumber,lockData,successCallback,failedCallback);
  } 
  else if (option === "Clear all fingerprints") 
  {
   Ttlock.clearAllFingerprints(lockData,successCallback,failedCallback);
  } 





  else if (option === "Rest lock") 
  {
    Ttlock.resetLock(lockData,()=>{

    }, failedCallback)
  } 
  else if (option === "Reset ekey")
  {

  }
}

const LockPage = (props) => {
  const { route } = props;
  const { scanLockMap, lockData } = route.params;
  const renderItem = ({ item }) => {
    return (

      <TouchableHighlight
        onPress={() => {
          optionClick(item, lockData);
        }}>
        <Text style={styles.item}>{item}</Text>
      </TouchableHighlight>

    );
  };

  
  // React.useEffect(()=>{
  //   //Reset Lock after componentWillUnmount
  //   return function resetLock(){Ttlock.resetLock(lockData,()=>{},()=>{})}
  // })

  return (
    <FlatList
      data={optionsData}
      renderItem={renderItem}
      keyExtractor={item => item}
    />
  );
}


const styles = StyleSheet.create({
  item: {
    lineHeight: 70,
    paddingLeft: 20,
    borderBottomColor: "gray",
    borderWidth: 0.5
  },
});

export default LockPage;