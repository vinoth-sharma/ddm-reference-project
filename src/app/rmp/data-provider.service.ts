import { Injectable } from '@angular/core';
import { DjangoService } from './django.service'
import { HttpClient } from '@angular/common/http'
import 'rxjs/add/operator/map';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  private lookUpTableData : object
  private lookUpData : object
  // public userSelectionData = new BehaviorSubject({})
  private user_id : number = 1
  constructor(private django: DjangoService, private httpClient : HttpClient) { }

  getLookupTableData(){
    return this.lookUpTableData
  }

  getLookupData(){
    return this.lookUpData
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
    let loadLookUpTableData_Flag =  this.loadLookUpTableData();
    // let report_list = this
    return (loadLookUpTableData_Flag && loadLookUpData_Flag)
  }

  updateLookUpTableData(){
    this.django.getLookupValues().subscribe(response =>{
      this.lookUpTableData = response;
    })
  }

  updateLookUpData(){
    this.django.getNewData().subscribe(response => {
      this.lookUpData = response;
    })
  }

  loadLookUpTableData() {
    return new Promise((resolve, reject) => {
        this.django.getLookupValues().subscribe(response => {
        this.lookUpTableData = response;
        resolve(true);
      })
    })
   }

   loadLookUpData() {
    return new Promise((resolve, reject) => {
        this.django.getNewData().subscribe(response => {
        this.lookUpData = response;
        resolve(true);
      })
    })
   }

  //  loadUserSelectionData(user_id){
  //   return new Promise((resolve, reject) => {
  //     // this.httpClient.get("http://localhost:8000/RMP/user_selection/?ddm_rmp_user_info_id="+user_id)
  //     this.django.division_selected(user_id).subscribe(response => {
  //     this.userSelectionData.next(response);
  //     console.log("LoadUserSelection")
  //     console.log(response)
  //     resolve(true);
  //     })
  //   })
  //  }
      
}