import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { Response } from 'selenium-webdriver/http';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js'

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  public searchText;
  public editing;
  public p;
  summary: Object;
  report_id: number
  reports: any;
  generated_id_service: any;
  order: any;
  reverse: boolean;

  constructor(private django: DjangoService, private generated_report_service: GeneratedReportService,
    private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    setTimeout(() => {
      this.generated_report_service.changeButtonStatus(false)
    })
    this.spinner.show()
    this.django.get_report_matrix().subscribe(list => {
      this.reports = list['data']
      // console.log(this.reports)
      this.spinner.hide()
    })
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
      // console.log() 
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
    })
  }

  setOrder(value?: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    // console.log('setOrder', value, this.order)
  }
}