import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { ToastrService } from "ngx-toastr";
import { DjangoService } from 'src/app/rmp/django.service';

// const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
//   'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
//   'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
//   'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
//   'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
//   'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
//   'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
//   'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'app-request-on-behalf',
  templateUrl: './request-on-behalf.component.html',
  styleUrls: ['./request-on-behalf.component.css']
})
export class RequestOnBehalfComponent implements OnInit{


  public model: any;

  // search = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map(term => term.length < 2 ? []
  //       : states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  //   )
  private userList:Array<string> = []

  constructor(private generated_service : GeneratedReportService,
              private django: DjangoService,
              private toastr: ToastrService) { 
              this.userList = ["Akshay",
                          "Bharat",
                          "Charchit",
                          "Deepak",
                          "Esaac",
                          "Fernandez",
                          "Gujju",
                          "Hitesh",
                          "Ishan",
                          "Jatin",
                          "Kunal",
                          "Laxman",
                          "Manish",
                          "NightKing",
                          "Ojas",
                          "Prayansh",
                          "Qyburn",
                          "Rhaegar",
                          "Snow",
                          "Targaeryan",
                          "Umbers",
                          "Viserys",
                          "Whitewalker",
                          "XMen",
                          "Ygritte",
                          "Zinchenko"]
      
              }

  ngOnInit() {
  }

  // searchUser(){
  //   console.log(this.model);
  //   // this.django.getDistributionList(this.model).subscribe(list =>{
  //   //   this.userList = list['data'];
  //   // })
    
  // }

  searchUserList = (text$: Observable<string>) =>{

    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.userList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0,10))
    ) 
  }
  

  onBehalf(name){
    console.log(name);
    this.generated_service.behalf_of(name)
    document.getElementById("errorModalMessage").innerHTML = "<h5>"+"Proceed to create report on Behalf of "+name+"</h5>";
    document.getElementById("errorTrigger").click()
    // alert("Proceed to create report on Behalf of "+ name);
  }
}
