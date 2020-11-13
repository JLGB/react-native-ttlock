import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
const ttlockModule = NativeModules.Ttlock;
const ttlockEventEmitter = new NativeEventEmitter(ttlockModule);




class TtGateway {

}


class Ttlock {
  static subscriptionMap = new Map();
  static event = {
    scanLock: "EventScanLock",
    addCardProgrress: "EventAddCardProgrress",
    addFingerprintProgress: "EventAddFingerprintProgrress",
    bluetoothState: "EventBluetoothState"
  };

  static startScan(callback) {
    let subscription = Ttlock.subscriptionMap.get(Ttlock.event.scanLock)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttlockEventEmitter.addListener(Ttlock.event.scanLock, (responData) => {
      callback(responData);
    });
    Ttlock.subscriptionMap.set(Ttlock.event.scanLock, subscription);
    ttlockModule.startScan();
  }

  static stopScan() {
    ttlockModule.stopScan();
    let subscription = Ttlock.subscriptionMap.get(Ttlock.event.scanLock)
    if (subscription !== undefined) {
      subscription.remove();
    }
    Ttlock.subscriptionMap.delete(Ttlock.event.scanLock);
  }

  static initLock(object, success, fail) {
    ttlockModule.initLock(object, success, fail);
  }

  static resetLock(lockData, success, fail) {
    ttlockModule.resetLock(lockData, success, fail);
  }

  static resetEkey(lockData, success, fail) {
    ttlockModule.resetEkey(lockData, success, fail);
  }

  //enum control lock
  static ControlEnum = Object.freeze({
    unlock: 0,
    lock: 1
  })

  /**
   * 
   * @param control ControlEnum
   * @param lockData String
   * @param success successful callback
   * @param fail failed callback
   */
  static controlLock(control, lockData, success, fail) {
    ttlockModule.controlLock(control, lockData, success, fail);
  }

  static createCustomPasscode(passcode, startDate, endDate, lockData, success, fail) {
    ttlockModule.createCustomPasscode(passcode, startDate, endDate, lockData, success, fail);
  }

  static modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail) {
    ttlockModule.modifyPasscode(passcodeOrigin, passcodeNew, startDate, endDate, lockData, success, fail);
  }

  static deletePasscode(passcode, lockData, success, fail) {
    ttlockModule.deletePasscode(passcode, lockData, success, fail);
  }

  static resetPasscode(lockData, success, fail) {
    ttlockModule.resetPasscode(lockData, success, fail);
  }

  static getLockSwitchState(lockData, success, fail) {
    ttlockModule.getLockSwitchState(lockData, success, fail);
  }

  static addCard(cycleList, startDate, endDate, lockData, progress, success, fail) {
    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addCardProgrress, () => {
      if(progress !== undefined){
        progress();
      }
    });
    ttlockModule.addCard(cycleList, startDate, endDate, lockData, (responData) => {
      subscription.remove();
      if(success !== undefined){
        success(responData);
      }
    }, (responData) => {
      subscription.remove();
      if(fail !== undefined){
        fail(responData)
      }
    });
  }

  static modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail) {
    ttlockModule.modifyCardValidityPeriod(cardNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static deleteCard(cardNumber, lockData, success, fail) {
    ttlockModule.deleteCard(cardNumber, lockData, success, fail);
  }

  static clearAllCards(lockData, success, fail) {
    ttlockModule.clearAllCards(lockData, success, fail);
  }


  static addFingerprint(cycleList, startDate, endDate, lockData, progress, success, fail) {
    let subscription = ttlockEventEmitter.addListener(Ttlock.event.addFingerprintProgress, (responData) => {
      if(progress !== undefined){
        progress(responData);
      }
    });
    ttlockModule.addFingerprint(cycleList, startDate, endDate, lockData, (responData) => {
      subscription.remove();
      if(success !== undefined){
        success(responData);
      }
    }, (responData) => {
      subscription.remove();
      if(fail !== undefined){
        fail(responData)
      }
    });
  }

  static modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail) {
    ttlockModule.modifyFingerprintValidityPeriod(fingerprintNumber, cycleList, startDate, endDate, lockData, success, fail);
  }

  static deleteFingerprint(fingerprintNumber, lockData, success, fail) {
    ttlockModule.deleteFingerprint(fingerprintNumber, lockData, success, fail);
  }

  static clearAllFingerprints(lockData, success, fail) {
    ttlockModule.clearAllFingerprints(lockData, success, fail);
  }

  static modifyAdminPasscode(adminPasscode, lockData, success, fail) {
    ttlockModule.modifyAdminPasscode(adminPasscode, lockData, success, fail);
  }

  static setLockTime(timestamp, lockData, success, fail) {
    ttlockModule.setLockTime(timestamp, lockData, success, fail);
  }

  static getLockTime(lockData, success, fail) {
    ttlockModule.getLockTime(lockData, success, fail);
  }

  //enum config lock
  static LockRecord= Object.freeze({
    latest: 0,
    all: 1
  })
  static getLockOperateRecord(type, lockData, success, fail) {
    ttlockModule.getLockOperateRecord(type, lockData, success, fail);
  }

  static getLockAutomaticLockingPeriodicTime(lockData, success, fail) {
    ttlockModule.getLockAutomaticLockingPeriodicTime(lockData, success, fail);
  }

  static setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail) {
    ttlockModule.setLockAutomaticLockingPeriodicTime(seconds, lockData, success, fail);
  }

  static getLockRemoteUnlockSwitchState(lockData, success, fail) {
    ttlockModule.getLockRemoteUnlockSwitchState(lockData, success, fail);
  }

  static setLockRemoteUnlockSwitchState(isOn, lockData, success, fail) {
    ttlockModule.setLockRemoteUnlockSwitchState(isOn, lockData, success, fail);
  }


  //enum config lock
  static LockConfigEnum = Object.freeze({
    audio: 0,
    passcodeVisible: 1,
    freeze: 2,
    tamperAlert: 3,
    resetButton: 4,
    privacyLock: 5
  })
  static getLockConfig(config, lockData, success, fail) {
    ttlockModule.getLockConfig(config, lockData, success, fail);
  }

  static setLockConfig(config, isOn, lockData, success, fail) {
    ttlockModule.setLockConfig(config, isOn, lockData, success, fail);
  }


  //enum config lock
  static LockPassageModeEnum = Object.freeze({
    weekly: 0,
    monthly: 1
  })
  static addPassageMode(type, weekly, monthly, startDate, endDate, lockData, success, fail) {
    ttlockModule.addPassageMode(type, weekly, monthly, startDate, endDate, lockData, success, fail);
  }

  static clearAllPassageModes(lockData, success, fail) {
    ttlockModule.clearAllPassageModes(lockData, success, fail);
  }


  static addBluetoothStateListener(callback) {
    let subscription = Ttlock.subscriptionMap.get(Ttlock.event.bluetoothState)
    if (subscription !== undefined) {
      subscription.remove()
    }
    subscription = ttlockEventEmitter.addListener(Ttlock.event.bluetoothState, (responData) => {
      callback(responData);
    });
    Ttlock.subscriptionMap.set(Ttlock.event.bluetoothState, subscription);
  }

  static deleteBluetoothStateListener() {
    let subscription = Ttlock.subscriptionMap.get(Ttlock.event.bluetoothState)
    if (subscription !== undefined) {
      subscription.remove();
    }
    Ttlock.subscriptionMap.delete(Ttlock.event.bluetoothState);
  }

  static supportFunction(featureValue, lockData, callback) {
    ttlockModule.supportFunction(fuction, lockData, callback);
  }

}

export { Ttlock, TtGateway }
