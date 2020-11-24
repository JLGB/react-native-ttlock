
import { makeAutoObservable } from "mobx"
import { Ttlock, TtGateway } from 'react-native-ttlock';


class Store {
  constructor() {
    makeAutoObservable(this)
  }


  lockList = []

  gatewayList = []

  wifiList = []


  startScanLock() {
    this.lockList = [];
    Ttlock.startScan(data => {
      let isContainData = false;
      let isInitStateChanged = false;
      this.lockList.forEach((oldData) => {
        if (oldData.lockMac === data.lockMac) {
          isContainData = true;
          if (oldData.isInited !== data.isInited) {
            oldData.isInited = data.isInited;
            isInitStateChanged = true;
          }
        }
      });
      if (isContainData === false) {
        this.lockList.push(data)
        // setDataList(dataList)
      }

      if (isContainData === false || isInitStateChanged) {
        this.lockList.sort((data1, data2) => {
          return data1.isInited > data2.isInited;
        })
      }
    });
  }

  startScanGateway() {
    this.gatewayList = [];
    TtGateway.startScan((data) => {
      let isContainData = false;
      this.gatewayList.forEach((oldData) => {
        if (oldData.gatewayMac === data.gatewayMac) {
          isContainData = true;
        }
      });
      if (isContainData === false) {
        this.gatewayList.push(data);
        this.gatewayList = this.gatewayList.slice();
      }
    });
  }

  startScanWifi() {
    this.wifiList = [];
    TtGateway.getNearbyWifi((list) => {
      list.forEach(data => {
        this.wifiList.push(data)
      });
      this.wifiList = this.wifiList.slice();
    }, () => {

    }, (errorCode, errorMessage) => {
      console.log("getNearbyWifi fail");
    })
  }


}

export default new Store()
