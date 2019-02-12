import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AuthenticationService } from '../authentication.service';
import { SemanticNewService } from '../semantic-new/semantic-new.service';

@Component({
  selector: 'app-semantic-existing',
  templateUrl: './semantic-existing.component.html',
  styleUrls: ['./semantic-existing.component.css']
})

export class SemanticExistingComponent implements OnInit {

  public userId: string;
  public semanticLayers = [];

  constructor(private user: AuthenticationService, private semanticNewService: SemanticNewService) {
    this.user.Method$.subscribe((userid) => this.userId = userid);
      this.semanticNewService.dataMethod$.subscribe((semanticLayers) => {this.semanticLayers = semanticLayers});
  }

  ngOnInit() {
  }

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
