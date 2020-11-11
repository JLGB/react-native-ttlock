import { makeAutoObservable } from "mobx"

class Store {

  constructor() {
    makeAutoObservable(this)
  }

  scanLockDataList = []


}



export default new Store();