import {
  NativeModules,
  NativeEventEmitter,
  // EmitterSubscription,
} from 'react-native';

import type { ScanGatewayModal, ScanLockModal, InitLockParam, InitGatewayParam, CardFingerprintCycleParam, ScanWifiModal, InitGatewayModal } from './types'

const ttlockModule = NativeModules.Ttlock;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);



const subscriptionMap = new Map();

class TtGateway {
  static defaultCallback = function () { };

  static event = {
    scanGateway: "EventScanGateway",
    scanWifi: "EventScanWifi"
  };

  static startScan(callback: ((scanGatewayModal: ScanGatewayModal) => void)) {
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttlockEventEmitter.addListener(TtGateway.event.scanGateway, callback);
    subscriptionMap.set(TtGateway.event.scanGateway, subscription);
    ttlockModule.startScanGateway();
  }

  static stopScan() {
    ttlockModule.stopScanGateway();
    let subscription = subscriptionMap.get(TtGateway.event.scanGateway)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(TtGateway.event.scanGateway);
  }

  static connect(mac: string, success: ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let stateList = [
      { code: 0, description: "The bluetooth connect timeout" },
      { code: 1, description: "The bluetooth connect success" },
      { code: 2, description: "The bluetooth connect fail" }
    ]
    ttlockModule.connect(mac, (state: number) => {
      if (state === 1) {
        success(stateList[state].code, stateList[state].description);
      } else {
        fail!(stateList[state].code, stateList[state].description);
      }
    });
  }

  static getNearbyWifi(progress: ((scanWifiModal: ScanWifiModal[]) => void), finish: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {

    progress = progress || this.defaultCallback;
    finish = finish || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let subscription = ttlockEventEmitter.addListener(TtGateway.event.scanWifi, (responData) => {
      progress(responData);
    });

    ttlockModule.getNearbyWifi((state: number) => {
      subscription.remove();
      if (state === 0) {
        finish!();
      } else {
        fail!(1, "Failed to get nearby wifi. Please confirm whether there is wifi nearby or reconnect to the gateway try again");
      }
    });
  }

  static initGateway(object: InitGatewayParam, success: ((initGatewayModal: InitGatewayModal) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initGateway(object, success, (errorCode: number)=>{
      let description = "Init gateway fail.";   
      if(errorCode === 3) {
        description += "Wrong wifi";
      }else if(errorCode === 4) {
        description += "Wrong wifi password";
      }
      fail(errorCode, description);
    });
  }

}


class Ttlock {

  static defaultCallback = function () { };

  static event = {
    scanLock: "EventScanLock",
    addCardProgrress: "EventAddCardProgrress",
    addFingerprintProgress: "EventAddFingerprintProgrress",
    bluetoothState: "EventBluetoothState"
  };

  static startScan(callback: null | ((lockScanModal: ScanLockModal) => void)) {
    let subscription = subscriptionMap.get(Ttlock.event.scanLock)
    if (subscription !== undefined) {
      subscription.remove()
    }
    callback = callback || this.defaultCallback;
    subscription = ttlockEventEmitter.addListener(Ttlock.event.scanLock, callback);
    subscriptionMap.set(Ttlock.event.scanLock, subscription);
    ttlockModule.startScan();
  }

  static stopScan() {
    ttlockModule.stopScan();
    let subscription = subscriptionMap.get(Ttlock.event.scanLock)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(Ttlock.event.scanLock);
  }

  static initLock(object: InitLockParam, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.initLock(object, success, fail);
  }

  static resetLock(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetLock(lockData, success, fail);
  }

  static resetEkey(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetEkey(lockData, success, fail);
  }

  //enum control lock
  static controlEnum = Object.freeze({
    unlock: 0,
    lock: 1
  })

  /**
   * 
   * @param control controlEnum
   * @param lockData string
   * @param success successful callback
   * @param fail failed callback
   */
  static controlLock(control: number, lockData: string, success: null | ((lockTime: number, electricQuantity: number, uniqueId: number) => void), fail: null | ((errorCode: number, description: string) => void)) {
    fail = fail || this.defaultCallback;
    success = success || this.defaultCallback;
    ttlockModule.controlLock(control, lockData, success, fail);
  }

  static createCustomPasscode(passcode: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.createCustomPasscode(passcode, startDate, endDate, lockData, success, fail);
  }

  static modifyPasscode(passcodeOrigin: string, passcodeNew: string, startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail);
  }

  static deletePasscode(passcode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deletePasscode(passcode, lockData, success, fail);
  }

  static resetPasscode(lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.resetPasscode(lockData, success, fail);
  }

  static getLockSwitchState(lockData: string, success: null | ((state: number, description: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let stateList = [
      { code: 0, description: "The lock state is locked" },
      { code: 1, description: "The lock state is unlocked" },
      { code: 2, description: "The lock state is unknow" },
      { code: 3, description: "A car on the lock" },
    ]

    ttlockModule.getLockSwitchState(lockData, (state: number) => {
      success!(stateList[state].code, stateList[state].description);
    }, fail);
  }

  static addCard(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addCardProgrress, () => {
      progress();
    });
    ttlockModule.addCard(cycleList, startDate, endDate, lockData, (cardNumber: string) => {
      subscription.remove();
      success!(cardNumber);
    }, (errorCode: number, errorDesc: string) => {
      subscription.remove();
      fail!(errorCode, errorDesc);
    });
  }

  static modifyCardValidityPeriod(cardNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static deleteCard(cardNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteCard(cardNumber, lockData, success, fail);
  }

  static clearAllCards(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllCards(lockData, success, fail);
  }


  static addFingerprint(cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, progress: null | ((currentCount: number, totalCount: number) => void), success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) {

    progress = progress || this.defaultCallback;
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];

    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addFingerprintProgress, (dataArray: number[]) => {
      progress!(dataArray[0], dataArray[1]);
    });
    ttlockModule.addFingerprint(cycleList, startDate, endDate, lockData, (fingerprintNumber: string) => {
      subscription.remove();
      success!(fingerprintNumber);
    }, (errorCode: number, errorDesc: string) => {
      subscription.remove();
      fail!(errorCode, errorDesc);
    });
  }

  static modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | CardFingerprintCycleParam[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    cycleList = cycleList || [];
    ttlockModule.modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static deleteFingerprint(fingerprintNumber: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.deleteFingerprint(fingerprintNumber, lockData, success, fail);
  }

  static clearAllFingerprints(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllFingerprints(lockData, success, fail);
  }

  static modifyAdminPasscode(adminPasscode: string, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.modifyAdminPasscode(adminPasscode, lockData, success, fail);
  }

  static setLockTime(timestamp: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockTime(timestamp, lockData, success, fail);
  }

  static getLockTime(lockData: string, success: null | ((lockTimestamp: number) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockTime(lockData, success, fail);
  }

  //enum config lock
  static lockRecordEnum = Object.freeze({
    latest: 0,
    all: 1
  })
  static getLockOperateRecord(type: number, lockData: string, success: null | ((records: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockOperateRecord(type, lockData, success, fail);
  }

  static getLockAutomaticLockingPeriodicTime(lockData: string, success: null | ((currentTime: number, maxTime: number, minTime: number) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockAutomaticLockingPeriodicTime(lockData, success, fail);
  }

  static setLockAutomaticLockingPeriodicTime(seconds: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail);
  }

  static getLockRemoteUnlockSwitchState(lockData: string, success: null | ((isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockRemoteUnlockSwitchState(lockData, success, fail);
  }

  static setLockRemoteUnlockSwitchState(isOn: boolean, lockData: string, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockRemoteUnlockSwitchState(isOn, lockData, success, fail);
  }


  //enum config lock
  static lockConfigEnum = Object.freeze({
    audio: 0,
    passcodeVisible: 1,
    freeze: 2,
    tamperAlert: 3,
    resetButton: 4,
    privacyLock: 5
  })
  static getLockConfig(config: number, lockData: string, success: null | ((type: number, isOn: boolean) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.getLockConfig(config, lockData, success, fail);
  }

  static setLockConfig(config: number, isOn: boolean, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.setLockConfig(config, isOn, lockData, success, fail);
  }


  //enum  lock passage mode
  static lockPassageModeEnum = Object.freeze({
    weekly: 0,
    monthly: 1
  })
  static addPassageMode(type: number, days: number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    
    let weekly = this.lockPassageModeEnum.weekly === type ? days : [];
    let monthly = this.lockPassageModeEnum.monthly === type ? days : [];

    ttlockModule.addPassageMode(type, weekly, monthly, startDate, endDate, lockData, success, fail);
  }


  static clearAllPassageModes(lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.clearAllPassageModes(lockData, success, fail);
  }



  static addBluetoothStateListener(callback: (state: number, description: string) => void) {
    let subscription = subscriptionMap.get(Ttlock.event.bluetoothState)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttlockEventEmitter.addListener(Ttlock.event.bluetoothState, (state: number) => {
      let bluetoothStateList = [
        { code: 0, description: "The bluetooth state is unknow" },
        { code: 1, description: "The bluetooth state is resetting" },
        { code: 2, description: "Current device unsupport bluetooth" },
        { code: 3, description: "The bluetooth is unauthorized" },
        { code: 4, description: "The bluetooth is ok" },
        { code: 5, description: "The bluetooth is off" },
      ]
      callback(bluetoothStateList[state].code, bluetoothStateList[state].description);
    });
    subscriptionMap.set(Ttlock.event.bluetoothState, subscription);
  }

  static deleteBluetoothStateListener() {
    let subscription = subscriptionMap.get(Ttlock.event.bluetoothState)
    if (subscription !== undefined) {
      subscription.remove();
    }
    subscriptionMap.delete(Ttlock.event.bluetoothState);
  }

  //enum config lock
  static lockFunction = Object.freeze({
    passcode: 0,
    icCard : 1,
    fingerprint : 2,
    wristband : 3,
    autoLock : 4,
    deletePasscode : 5,
    managePasscode : 7,
    locking : 8,
    passcodeVisible : 9,
    gatewayUnlock : 10,
    lockFreeze : 11,
    cyclePassword : 12,
    doorSensor : 13,
    remoteUnlockSwicth : 14,
    audioSwitch : 15,
    nbIot : 16,
    getAdminPasscode : 18,
    htelCard : 19,
    noClock : 20,
    noBroadcastInNormal : 21,
    passageMode : 22,
    turnOffAutoLock : 23,
    wirelessKeypad : 24,
    light : 25,
    hotelCardBlacklist : 26,
    identityCard : 27,
    tamperAlert : 28,
    resetButton : 29,
    privacyLock : 30,
    deadLock : 32,
    cyclicCardOrFingerprint : 34,
    fingerVein : 37,
    nbAwake : 39,
  })
  static supportFunction(fuction: number, lockData: string, callback: (isSupport: boolean) => void) {
    ttlockModule.supportFunction(fuction, lockData, callback);
  }

}







export { Ttlock, TtGateway }
export * from './types'
