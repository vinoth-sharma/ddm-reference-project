import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService}  from "ngx-spinner";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  order: string = 'info.name';
  reverse: boolean = false;
  report : any;
  sortedCollection: any[];
  column: any[];
  reports: any;
  // searchText:string = '';

  constructor(private generated_id_service: GeneratedReportService,
    private orderPipe: OrderPipe, private django: DjangoService, private spinner: NgxSpinnerService) {

    }
  
  ngOnInit(){
    localStorage.removeItem("report_id")
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.spinner.show()
    this.django.get_report_list().subscribe(list => {
      this.reports = list['data']
      // console.log(this.reports)
      this.spinner.hide()
    },err=>{
      this.spinner.hide()
    })
  }

  xlsxJson(){
    xlsxPopulate.fromBlankAsync().then(workbook => {
      const EXCEL_EXTENSION = '.xlsx';
      const wb = workbook.sheet("Sheet1");
      const headings = Object.keys(this.reports[0]);
      headings.forEach((heading, index) => {
        const cell = `${String.fromCharCode(index + 65)}1`;
        wb.cell(cell).value(heading)
      });
      
      const transformedData = this.reports.map(item =>(headings.map(key => item[key] instanceof Array ? item[key].join(","): item[key])))
      const colA = wb.cell("A2").value(transformedData);
      
      workbook.outputAsync().then(function(blob){
        if (window.navigator && window.navigator.msSaveOrOpenBlob){
          //If IE, you must use a diffrent method 
          window.navigator.msSaveOrOpenBlob(blob,
            "Reports" + new Date().getTime() + EXCEL_EXTENSION
          );
        } 
        else{
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
    })
  }

   setOrder(value: any ) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    // console.log('setOrder', value, this.order)
  }
}