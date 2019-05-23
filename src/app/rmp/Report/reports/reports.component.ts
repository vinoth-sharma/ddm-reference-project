import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js'
import * as $ from 'jquery';
import { AuthenticationService } from "src/app/authentication.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  public searchText;
  public p;
  public dropdownSettings;
  public dropdownList;
  public selectedItems;
  public ddm_rmp_post_report_id;
  public ddm_rmp_status_date;
  public title;
  public report_name;
  public onItemSelect;
  public onSelectAll;
  order: string = 'info.name';
  reverse: boolean = false;
  report: any;
  sortedCollection: any[];
  column: any[];
  reports: any = null;
  report_id: any;
  favourite: any = [];
  user_role : string;
  param: any;
  orderType: any;

  constructor(private generated_id_service: GeneratedReportService,private auth_service :AuthenticationService, private django: DjangoService, private spinner: NgxSpinnerService) {
      this.auth_service.myMethod$.subscribe(role =>{
        if (role) {
          this.user_role = role["role"]
        }
      })
  }

  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    // this.spinner.show()
    this.django.get_report_list().subscribe(list => {
      console.log(list);
      this.reports = list['data']
      for (var i=0; i<this.reports.length; i++) {
      this.reports[i]['frequency_data_filtered'] = this.reports[i].frequency_data.filter(element => (element != 'Monday' && element != 'Tuesday' && element != 'Wednesday' && element != 'Thursday' && element != 'Friday' && element != 'Other') )
      }
      // this.reports_freq_desc = this.reports.filter(element.frequency_data)
      console.log(this.reports)
      // this.spinner.hide()
    }, err => {
      // this.spinner.hide()
    })
  }

  checked(id, event) {
    this.spinner.show()
    console.log(event.target.checked);
    this.favourite = event.target.checked;
    var finalObj = {'report_id' : id, 'favorite' : this.favourite}
    this.django.ddm_rmp_favourite(finalObj).subscribe(response=>{
      
      if(response['message'] == "success"){
        this.spinner.hide()
        console.log(response)
      }
      },err=>{
        this.spinner.hide()
      })
    }
  

  // push_check(id: number) {
    
  // }

  sort(typeVal) {
    this.param = typeVal.toLowerCase().replace(/\s/g, "_");;
    this.reports[typeVal] = !this.reports[typeVal] ? "reverse" : "";
    this.orderType = this.reports[typeVal];
  }

  xlsxJson() {
    xlsxPopulate.fromBlankAsync().then(workbook => {
      const EXCEL_EXTENSION = '.xlsx';
      const wb = workbook.sheet("Sheet1");
      const headings = Object.keys(this.reports[0]);
      headings.forEach((heading, index) => {
        const cell = `${String.fromCharCode(index + 65)}1`;
        wb.cell(cell).value(heading)
      });

      const transformedData = this.reports.map(item => (headings.map(key => item[key] instanceof Array ? item[key].join(",") : item[key])))
      const colA = wb.cell("A2").value(transformedData);

      workbook.outputAsync().then(function (blob) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //If IE, you must use a diffrent method 
          window.navigator.msSaveOrOpenBlob(blob,
            "Reports" + new Date().getTime() + EXCEL_EXTENSION
          );
        }
        else {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.href = url;
          a.download = "Reports" + new Date().getTime() + EXCEL_EXTENSION;
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a)
        }
      })
    }).catch(error => {
      console.log(error);
    });
  }

  setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    // console.log('setOrder', value, this.order)
  }
}