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
  
  constructor(private generated_service : GeneratedReportService,
              private django: DjangoService,
              private toastr: ToastrService,) { 
      this.model = "";
              }

  ngOnInit() {}
    





  searchUser(model){
    console.log(model);
    if(model.length > 1){
      this.django.getDistributionList(model).subscribe(list =>{
        this.userList = list['data'];
      })
    }
    
  }

  searchUserList = (text$: Observable<string>) =>{

    return text$.pipe(
      debounceTime(10),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.userList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0,20))
    ) 
  }
  

  onBehalf(name){
    //console.log(name);
    this.generated_service.behalf_of(name)
    document.getElementById("errorModalMessage").innerHTML = "<h5>"+"Proceed to create report on Behalf of "+name+"</h5>";
    document.getElementById("errorTrigger").click()
    // alert("Proceed to create report on Behalf of "+ name);
  }
}
