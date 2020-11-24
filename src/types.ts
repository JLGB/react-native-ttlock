export interface ScanLockModal {
    lockName: string,
    lockMac: string,
    isInited: boolean,
    isKeyboardActivated: boolean,
    electricQuantity: number,
    lockVersion: string,
    lockSwitchState: number,
    RSSI: number
    oneMeterRSSI: number
  }
  
  export interface ScanGatewayModal {
    gatewayName: string,
    gatewayMac: string,
    isDfuMode: boolean,
    rssi: number
  }
  
  export interface ScanWifiModal {
    wifi: string,
    rssi: number
  }
  
  export interface InitLockModal {
    lockMac: string,
    lockVersion: string
  }
  
  export interface InitGatewayModal {
    gatewayName: string,
    wifi: string,
    wifiPassword: string,
    ttlockUid: number,
    ttlockLoginPassword: string,
  }
  
  
  export interface CardFingerprintCycleModal {
    weekDay: number,
    startTime: number,
    endTime: number
  }