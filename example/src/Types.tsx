
import React from 'react';


export type ScanLockMap = {
  lockName: String | undefined,
  lockMac: String ,
  isInited: Boolean,
  isKeyboardActivated: Boolean,
  electricQuantity: Number,
  lockVersion: String,
  lockSwitchState: Number,
  RSSI: f
  oneMeterRSSI: Number
}