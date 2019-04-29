import { Component, OnInit } from '@angular/core';
import { OrderPipe } from 'ngx-order-pipe';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import * as xlsxPopulate from 'node_modules/xlsx-populate/browser/xlsx-populate.min.js'

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
  reports: any;
  report_id: any;
  favourite: any = [];

  constructor(private generated_id_service: GeneratedReportService,
    private orderPipe: OrderPipe, private django: DjangoService, private spinner: NgxSpinnerService) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(false)
    })
    this.spinner.show()
    this.django.get_report_list().subscribe(list => {
      this.reports = list['data']
      // console.log(this.reports)
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }
  checkED(id) {
    let fav_id = "#" + "fav" + id
    let checked = ".checked" + fav_id
    let unchecked = ".unchecked" + fav_id
    $(checked).click(function () {
      $(checked).css("display", "none");
      $(unchecked).css("display", "block");
    })
    var index = this.favourite.indexOf(id);
    this.favourite.splice(index, 1);
    console.log(this.favourite)
  }

  uncheckED(id) {
    let fav_id = "#" + "fav" + id
    let checked = ".checked" + fav_id
    let unchecked = ".unchecked" + fav_id
    $(unchecked).click(function () {
      $(unchecked).css("display", "none");
      $(checked).css("display", "block");
    })
    this.push_check(id)
  }

  push_check(id: number) {
    if (!this.favourite.includes(id)) {
      this.favourite.push(id)
      console.log(this.favourite);
    }
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
    })
  }

  setOrder(value: any) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
    // console.log('setOrder', value, this.order)
  }
}