import { Injectable } from '@angular/core';
import { DjangoService } from './django.service'
import { HttpClient } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private lookUpTableData = new BehaviorSubject<object>(null)
  private lookUpData = new BehaviorSubject<object>(null)
  currentlookUpTableData = this.lookUpTableData.asObservable();
  currentlookupData = this.lookUpData.asObservable();
  // public userSelectionData = new BehaviorSubject({})
  private user_id : number = 1
  constructor(private django: DjangoService, private httpClient : HttpClient) {
    this.loadLookUpData();
    this.loadLookUpTableData();
    localStorage.removeItem('report_id')
  }
  
  // loadOnCall(){
  // }
  getLookupTableData(){
    return this.lookUpTableData
  }

  getLookupData() {
    return this.lookUpData
  }

  changelookUpTableData(message: object) {
    this.lookUpTableData.next(message)
    console.log(this.lookUpTableData)
  }

  changelookUpData(message: object) {
    this.lookUpTableData.next(message)
    console.log(this.lookUpData)
  }

  // getUserSelectionData(){
  //   let temp = {} 
  //   this.userSelectionData.subscribe(data=>{
  //     temp = data
  //     console.log("getUserSelection")
  //     console.log(temp)
  //   })
  //   return temp
  // }



  load() {
    // let user_selection_flag = this.loadUserSelectionData(this.user_id);
    let loadLookUpData_Flag = this.loadLookUpData();
    let loadLookUpTableData_Flag = this.loadLookUpTableData();
    // let report_list = this
    return (loadLookUpTableData_Flag && loadLookUpData_Flag)
  }

  // updateLookUpTableData(){
  //   this.django.getLookupValues().subscribe(response =>{
  //     this.lookUpTableData = response;
  //   })
  // }

  // updateLookUpData(){
  //   this.django.getNewData().subscribe(response => {
  //     this.lookUpData = response;
  //   })
  // }

  loadLookUpTableData() {
    return new Promise((resolve, reject) => {
      this.django.getLookupValues().subscribe(response => {
        this.lookUpTableData.next(response);
        resolve(true);
      })
    })
  }

  loadLookUpData() {
    return new Promise((resolve, reject) => {
      this.django.getNewData().subscribe(response => {
        this.lookUpData.next(response);
        resolve(true);
      })
    })
  }
}