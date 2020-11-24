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
  "Modify admin passcode to 9999",
  "Reset ekey",
  "Rest lock",
]

const successCallback = function (text: String) {
  console.log("Success:", text);

}
const progressCallback = function (text: String) {
  console.log("progress:", text);
}

const failedCallback = function (errorCode: number, errorMessage: string) {
  console.log("errorCode:", errorCode, "    errorMessage:", errorMessage);
}

var cardumber: string = "";
var fingerprintNumber: string = "";


const optionClick = (option: string, lockData: string) => {

  if (option === "Unlock/Lock") {
    Ttlock.controlLock(Ttlock.controlEnum.unlock, lockData, (lockTime: number, electricQuantity: number, uniqueId: number) => {
      let text = "lockTime:" + lockTime + "\n" + "electricQuantity:" + electricQuantity + "\n" + "uniqueId:" + uniqueId;
      successCallback(text);
    }, failedCallback)

  }

  if (option === "Get lock time") {
    Ttlock.getLockTime(lockData, (lockTimestamp: Number) => {
      let text = "lockTimestamp:" + lockTimestamp;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock time") {
    let timestamp = new Date().getTime();
    Ttlock.setLockTime(timestamp, lockData, () => {
      successCallback("set lock time success");
    }, failedCallback);
  }
  else if (option === "Get lock operate record") {
    Ttlock.getLockOperateRecord(Ttlock.lockRecordEnum.latest, lockData, successCallback, failedCallback);
  }
  else if (option === "Create custom passcode 1122") {
    // passcode valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.createCustomPasscode("1122", startDate, endDate, lockData, () => {
      successCallback("create cutome passcode success");
    }, failedCallback);
  }
  else if (option === "Modify passcode 1122 -> 2233") {

    // passcode valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.modifyPasscode("1122", "2233", startDate, endDate, lockData, () => {
      successCallback("modify passcode success");
    }, failedCallback);
  }

  else if (option === "Delete passcode 2233") {
    Ttlock.deletePasscode("2233", lockData, () => {
      successCallback("delete passcode success");
    }, failedCallback);
  }

  else if (option === "Reset passcode") {
    Ttlock.resetPasscode(lockData, (lockDataNew: String) => {
      //important: upload lockDataNew to ttlock server. 
      successCallback("reset passcode success, please upload lockDataNew to server");
      console.log(lockDataNew)
    }, failedCallback);
  }

  else if (option === "Get lock switch state") {

    Ttlock.getLockSwitchState(lockData, (state: number, description: string) => {
      let text = "state:" + state + "\n" + "description:" + description;
      successCallback(text);
    }, failedCallback);


  }
  else if (option === "Add card") {
    // card valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addCard(null, startDate, endDate, lockData, () => { }, (cardumber) => {
      let text = "cardumber:" + cardumber;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Modify card validity period") {
    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyCardValidityPeriod(cardumber, null, startDate, endDate, lockData, () => {
      let text = "modify card validity period success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Delete card") {
    Ttlock.deleteCard(cardumber, lockData, () => {
      let text = "delete card success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Clear all cards") {
    Ttlock.clearAllCards(lockData, () => {
      let text = "clear all cards success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Add fingerprint") {
    // card valid one day
    let startDate = new Date().getTime();
    let endDate = startDate + 24 * 3600 * 1000;
    Ttlock.addFingerprint(null, startDate, endDate, lockData, (currentCount: number, totalCount: number) => {
      let text = "currentCount:" + currentCount + "\n" + "totalCount:" + totalCount;
      progressCallback(text);
    }, (fingerprintNumber: String) => {
      let text = "fingerprintNumber:" + fingerprintNumber
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Modify fingerprint validity period") {
    // card valid one minute
    let startDate = new Date().getTime();
    let endDate = startDate + 1 * 60 * 1000;
    Ttlock.modifyFingerprintValidityPeriod(fingerprintNumber, null, startDate, endDate, lockData, () => {
      let text = "modify fingerprint validity period success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Delete fingerprint") {
    Ttlock.deleteFingerprint(fingerprintNumber, lockData, () => {
      let text = "delete fingerprint success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Clear all fingerprints") {
    Ttlock.clearAllFingerprints(lockData, () => {
      let text = "clear all fingerprints success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Get lock automatic locking periodic time") {
    Ttlock.getLockAutomaticLockingPeriodicTime(lockData, (currentTime: number, maxTime: number, minTime: number) =>{
      let text = "currentTime:" + currentTime + "\n" + "maxTime:" + maxTime + "\n" + "minTime:" + minTime;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock automatic locking periodic time") {
    let seconds = 20;
    Ttlock.setLockAutomaticLockingPeriodicTime(seconds, lockData, () => {
      let text = "set lock automatic lock periodic time success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock remote unlock switch state") {
    let isOn = true;
    Ttlock.setLockRemoteUnlockSwitchState(isOn, lockData, (lockDataNew: string) => {
      let text = "set lock remote unlock switch success, please upload lockDataNew to server";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback);
  }
  else if (option === "Get lock config") {
    Ttlock.getLockConfig(Ttlock.lockConfigEnum.audio, lockData, (type: number, isOn: boolean) => {
      let text = "type:" + type + "\n" + "isOn:" + isOn;
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Set lock config") {
    let isOn = true;
    Ttlock.setLockConfig(Ttlock.lockConfigEnum.audio, isOn, lockData, ()=>{
      let text = "config lock success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Add passage mode") {
    //minutes  8:00 am ---   17:00 pm
    let startTime = 8 * 60;
    let endTime = 17 * 60;
    // Ttlock.addPassageMode(Ttlock.lockPassageModeEnum.monthly, null, [1, 3, 28], startTime, endTime, lockData, successCallback, failedCallback);
    Ttlock.addPassageMode(Ttlock.lockPassageModeEnum.weekly, [1,2,7], null, startTime, endTime, lockData, ()=>{
      let text = "add passage mode success";
      successCallback(text);
    }, failedCallback);

  }
  else if (option === "Clear all passageModes") {
    Ttlock.clearAllPassageModes(lockData, ()=>{
      let text = "clear all passage modes success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Modify admin passcode to 9999") {
    let adminPasscode = "9999";
    Ttlock.modifyAdminPasscode(adminPasscode, lockData, ()=>{
      let text = "modify admin passcode success";
      successCallback(text);
    }, failedCallback);
  }
  else if (option === "Rest lock") {
    Ttlock.resetLock(lockData, ()=>{
      let text = "reset lock success";
      successCallback(text);
    }, failedCallback)
  }
  else if (option === "Reset ekey") {
    Ttlock.resetEkey(lockData, (lockDataNew) => {
      //important: upload lockDataNew to ttlock server. 
      let text = "reset ekey success";
      successCallback(text);
      console.log(lockDataNew);
    }, failedCallback)
  }
}

const LockPage = (props: any) => {
  // const { route } = props;
  // const { scanLockModal, lockData } = route.params;
  const lockData = "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";
  const renderItem = ({ item }: {item: string}) => {
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