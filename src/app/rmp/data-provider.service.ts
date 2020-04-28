// migrated by Bharath.s
import { Injectable } from '@angular/core';
import { DjangoService } from './django.service'
import { HttpClient } from '@angular/common/http'

import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private lookUpTableData = new BehaviorSubject<object>(null);
  private lookUpData = new BehaviorSubject<object>(null);
  private bacData = new BehaviorSubject<object>(null);
  private notifications = new BehaviorSubject<object>(null);
  private intialLoad = new BehaviorSubject<boolean>(null);
  private FileData = new BehaviorSubject<object>(null);
  currentIntialLoad = this.intialLoad.asObservable()
  currentlookUpTableData = this.lookUpTableData.asObservable();
  currentlookupData = this.lookUpData.asObservable();
  currentbacData = this.bacData.asObservable();
  currentNotifications = this.notifications.asObservable();
  currentFiles = this.FileData.asObservable();
  private user_id : number = 1
  filesList: any;
  constructor(private django: DjangoService, private httpClient : HttpClient) {
    this.loadNotifications();
    this.loadLookUpData();
    this.loadLookUpTableData();
    this.getFiles();
    localStorage.removeItem('report_id')
  }
  getFiles(){
    this.django.get_files().subscribe(ele =>{
      this.FileData.next(ele)
    })
  }

  changeFiles(ele){
    this.FileData.next(ele)
  }
  
  getLookupTableData(){
    return this.lookUpTableData
  }

  getLookupData() {
    return this.lookUpData
  }

  changeNotificationData(notification: object){
    this.notifications.next(notification)
  }

  changelookUpTableData(message: object) {
    this.lookUpTableData.next(message)
  }

  changelookUpData(message: object) {
    this.lookUpTableData.next(message)
  }

  changebacData(data:object){
    this.bacData.next(data);
  }

  changeIntialLoad(status:boolean){
    this.intialLoad.next(status)
  }
  load() {
    let loadLookUpData_Flag = this.loadLookUpData();
    let loadLookUpTableData_Flag = this.loadLookUpTableData();
    return (loadLookUpTableData_Flag && loadLookUpData_Flag);
  }
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

  loadNotifications(){
    return new Promise((resolve,reject)=>{
      this.django.get_notifications().subscribe(response =>{
        let data = [];
        if(response){
          data.push(...response['pending_requests'])
          data.push(...response['incomplete_requests'])
          data.push(...response['complete_requests'])
          data.push(...response['cancelled_requests'])
          data.push(...response['ongoing_requests'])
          data.push(...response['active_requests'])
          data.push(...response['recurring_obj'])
        }
        this.notifications.next(data)
        resolve(true);
      })
    })
  }
}