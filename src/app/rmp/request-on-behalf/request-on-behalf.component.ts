import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { ToastrService } from "ngx-toastr";
import { DjangoService } from 'src/app/rmp/django.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {switchMap} from 'rxjs/operators';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-request-on-behalf',
  templateUrl: './request-on-behalf.component.html',
  styleUrls: ['./request-on-behalf.component.css']
})
export class RequestOnBehalfComponent implements OnInit{

  public model: string;
  private userList:Array<string> = []
  tbdselectedItems_report = [];
  tbddropdownSettings_report = {};
  tbddropdownListfinal_report = [];
  fullName = ""
  discList: any;
  usersList = []
  
  constructor(private generated_service : GeneratedReportService,
              private django: DjangoService,
              private toastr: ToastrService,) { 
      this.model = "";
              }

  ngOnInit() {
    this.django.getLookupValues().subscribe(check_user_data => {
    
      this.discList = check_user_data['data']['users_list']
      console.log(this.discList);
      this.discList.forEach(ele =>{
          this.fullName = ele.first_name + ' ' + ele.last_name
          this.usersList.push({'full_name': this.fullName, 'users_table_id': ele.users_table_id})
      })
        this.tbddropdownListfinal_report = this.usersList

    })

    this.tbddropdownSettings_report = {
      text: "Users",
      singleSelection: true,
      primaryKey: 'users_table_id',
      labelKey: 'full_name',
      allowSearchFilter: true
    };
  }
    





  // searchUser(model){
  //   // console.log(model);
  //   // if(model.length > 1){

  //     return this.django.getDistributionList(model).subscribe(list =>{
  //       // console.log(list);
  //         this.userList = list['data'];
  //         let data = this.userList.filter(v => v.toLowerCase().indexOf(model.toLowerCase()) > -1).slice(0,20)
  //         // console.log(data);
          
  //         return data;
  //     })
  //   // }
  //   // else 
  //     // return []
    
  // }

  // searchUserList = (text$: Observable<string>) =>{
  //     // console.log(text$);

  //     let vs = text$.pipe(
  //       debounceTime(10),
  //       distinctUntilChanged(),
  //       switchMap(term =>{
  //         // console.log(this.django.getDistributionList(term));
          
  //         return this.django.getDistributionList(term);
  //         // console.log(this.userList);
  //         // console.log(this.searchUser(term));
  //         // console.log('down');
  //          this.django.getDistributionList(term).subscribe(list =>{
  //         // console.log(list);
  //         this.userList = list['data'];
  //         let data = this.userList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0,20)
  //         // console.log(data);
          
  //         return data;
  //     })
  //         // return [];
          
  //         // let list = term.length < 2 ? []: this.userList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0,20)
  //         // console.log(list);
  //         // return list
  //       })
  //       )
  //       // console.log('helo');
        
  //       // console.log(vs);
         
  //       return vs
  //     }
  

  onBehalf(){
    let name = this.tbdselectedItems_report[0]['full_name'];
    this.generated_service.behalf_of(name);
    console.log(name);
    document.getElementById("errorModalMessage").innerHTML = "<h5>"+"Proceed to create report on Behalf of "+name+"</h5>";
    document.getElementById("errorTrigger").click()
    // alert("Proceed to create report on Behalf of "+ name);
  }
}
