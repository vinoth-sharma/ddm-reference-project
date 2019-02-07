import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-semantic-existing',
  templateUrl: './semantic-existing.component.html',
  styleUrls: ['./semantic-existing.component.css']
})

export class SemanticExistingComponent implements OnInit {

  public userid;
  public slListTable;
  public isDisabled: boolean = true;

  constructor(private user: AuthenticationService) {
    this.user.Method$.subscribe(userid => this.userid = userid);
  }

  ngOnInit() {
    this.getSemanticlist();
  }

  public getSemanticlist() {
    this.user.getSldetails(this.userid).subscribe(
      (res) => {
        this.slListTable = res['data']['sl_list'];
        this.isDisabled = false;
      }, (error) => {
        console.log("FAILURE")
      })
  };

  public print() {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';

    const table = document.getElementById('semantic-layers');
    const workbook = XLSX.utils.table_to_book(table);
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });

    FileSaver.saveAs(data, 'semantic-layers-' + new Date().getTime() + EXCEL_EXTENSION);
  }
}