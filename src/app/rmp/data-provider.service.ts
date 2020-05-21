// migrated by Bharath.s
import { Injectable } from '@angular/core';
import { DjangoService } from './django.service'

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
  public currentIntialLoad = this.intialLoad.asObservable()
  public currentlookUpTableData = this.lookUpTableData.asObservable();
  public currentlookupData = this.lookUpData.asObservable();
  public currentbacData = this.bacData.asObservable();
  public currentNotifications = this.notifications.asObservable();
  public currentFiles = this.FileData.asObservable();
  private user_id: number = 1
  public filesList: any;

  constructor(private django: DjangoService) {
    this.loadNotifications();
    this.loadLookUpData();
    this.loadLookUpTableData();
    this.getFiles();
    localStorage.removeItem('report_id')
  }

  public getFiles() {
    this.django.get_files().subscribe(ele => {
      this.FileData.next(ele)
    })
  }

  public changeFiles(ele) {
    this.FileData.next(ele)
  }

  public getLookupTableData() {
    return this.lookUpTableData
  }

  public getLookupData() {
    return this.lookUpData
  }

  public changeNotificationData(notification: object) {
    this.notifications.next(notification)
  }

  public changelookUpTableData(message: object) {
    this.lookUpTableData.next(message)
  }

  public changelookUpData(message: object) {
    this.lookUpTableData.next(message)
  }

  public changebacData(data: object) {
    this.bacData.next(data);
  }

  public changeIntialLoad(status: boolean) {
    this.intialLoad.next(status)
  }

  public load() {
    let loadLookUpData_Flag = this.loadLookUpData();
    let loadLookUpTableData_Flag = this.loadLookUpTableData();
    return (loadLookUpTableData_Flag && loadLookUpData_Flag);
  }

  public loadLookUpTableData() {
    return new Promise((resolve, reject) => {
      this.django.getLookupValues().subscribe(response => {
        this.lookUpTableData.next(response);
        resolve(true);
      })
    })
  }

  public loadLookUpData() {
    return new Promise((resolve, reject) => {
      this.django.getNewData().subscribe(response => {
        this.lookUpData.next(response);
        resolve(true);
      })
    })
  }
  // loading notifications from server and sorting it in a required way
  public loadNotifications() {
    return new Promise((resolve, reject) => {
      this.django.get_notifications().subscribe(response => {
        let data = [];
        if (response) {
          data.push(...response['pending_requests'])
          data.push(...response['active_requests'])
          data.push(...response['complete_requests'])
          data.push(...response['ongoing_requests'])
          data.push(...response['recurring_requests'])
          data.push(...response['cancelled_requests'])
        }
        this.notifications.next(data)
        resolve(true);
      })
    })
  }
}