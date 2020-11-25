import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

import type {ScanGatewayModal, ScanLockModal, InitLockModal, InitGatewayModal,CardFingerprintCycleModal, ScanWifiModal} from './types'

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

  static connect(mac: string, success: ((state: number, description: string)=>void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let stateList = [
      { code: 0, description: "The bluetooth connect timeout" },
      { code: 1, description: "The bluetooth connect success" },
      { code: 2, description: "The bluetooth connect fail" }
    ]
    ttlockModule.connect(mac, (state: number)=>{
      success(stateList[state].code, stateList[state].description);
    }, fail);
  }

  static getNearbyWifi(progress: ((scanWifiModal: ScanWifiModal[])=>void), finish: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {

    progress = progress || this.defaultCallback;
    finish = finish || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let subscription = ttlockEventEmitter.addListener(TtGateway.event.scanWifi, (responData) => {
      progress(responData);
    });

    ttlockModule.getNearbyWifi(() => {
      subscription.remove();
      finish!();
    }, (errorCode: number, errorDesc: string) => {
      subscription.remove();
      fail!(errorCode, errorDesc);
    });
  }

  static initGateway(object: InitGatewayModal, success: ((modelNum: string, hardwareRevision: string, firmwareRevision: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;

    let paramObject = {
      SSID: object.wifi,
      wifiPwd: object.wifiPassword,
      gatewayName: object.gatewayName,
      uid: object.ttlockUid,
      userPwd: object.ttlockLoginPassword
    }
    ttlockModule.initLock(paramObject, success, fail);
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

  static initLock(object: InitLockModal, success: null | ((lockData: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
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

    ttlockModule.getLockSwitchState(lockData, (state: number)=>{
      success!(stateList[state].code, stateList[state].description);
    }, fail);
  }

  static addCard(cycleList: null | CardFingerprintCycleModal[], startDate: number, endDate: number, lockData: string, progress: (() => void), success: null | ((cardNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) {
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

  static modifyCardValidityPeriod(cardNumber: string, cycleList: null | CardFingerprintCycleModal[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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


  static addFingerprint(cycleList: null | CardFingerprintCycleModal[], startDate: number, endDate: number, lockData: string, progress: null | ((currentCount: number, totalCount: number) => void), success: null | ((fingerprintNumber: string) => void), fail: null | ((errorCode: number, description: string) => void)) {

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

  static modifyFingerprintValidityPeriod(fingerprintNumber: string, cycleList: null | CardFingerprintCycleModal[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
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


  //enum config lock
  static lockPassageModeEnum = Object.freeze({
    weekly: 0,
    monthly: 1
  })
  static addPassageMode(type: number, weekly: null | number[], monthly: null | number[], startDate: number, endDate: number, lockData: string, success: null | (() => void), fail: null | ((errorCode: number, description: string) => void)) {
    success = success || this.defaultCallback;
    fail = fail || this.defaultCallback;
    ttlockModule.addPassageMode(type, weekly === null ? [] : weekly, monthly === null ? [] : monthly, startDate, endDate, lockData, success, fail);
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

  static supportFunction(featureValue: string, lockData: string, callback: (isSupport: boolean) => void) {
    ttlockModule.supportFunction(featureValue, lockData, callback);
  }

}







export { Ttlock, TtGateway }
export * from './types'
