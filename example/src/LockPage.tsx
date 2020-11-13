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
    Ttlock.addCard([],startDate,endDate,lockData,()=>{},(number)=> {
      cardumber = number;
      successCallback("cardumber:" + cardumber);
    },failedCallback);
  } 
  else if (option === "Modify card validity period") 
  {
    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyCardValidityPeriod(cardumber,[],startDate,endDate,lockData,successCallback,failedCallback);
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
  // const { scanLockMap, lockData } = route.params;
  const lockData = "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";
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