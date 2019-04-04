import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

import { SharedDataService } from "../shared-data.service";
import { AuthenticationService } from '../../authentication.service';
import { FormulaService } from './formula.service';
import Utils from '../../../utils';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css']
})

export class FormulaComponent implements OnInit {

  public formula = {};
  public selectColumns:string;

  public semanticId: number;
  public userId: string;
  public show: boolean;

  public selectedTables = [];

  @Input() enablePreview:boolean;

  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private formulaService: FormulaService,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sharedDataService.selectedTables.subscribe(tables => this.selectedTables = tables)

    this.getUserDetails();

    this.sharedDataService.formula.subscribe(formula => {      
      this.formula = formula;

      let columns = [];
      for(let key in this.formula['select']){
        columns.push(...formula['select'][key]);
      }
      this.selectColumns = columns.join(', ');
    })
  }

  public goToView() {
    this.router.navigate(['semantic/sem-reports/preview']);
  }

  public getUserDetails() {
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        this.semanticId = element.data["semantic_id"];
      }
    });
    this.authenticationService.errorMethod$.subscribe(
      (userId) =>
        this.userId = userId);
  }


  public getColumns() {
    let columnData = [];

    this.selectedTables.forEach(element => {
      columnData.push(...element['columns']);
    });

    return columnData;
  }

  public getTableIds() {
    let tableIds = [];

    this.selectedTables.forEach(element => {
      tableIds.push(element['table']['sl_tables_id']);
    });

    return tableIds;
  }

  /**
   * saveReport
   */
  public saveReport(data: any) {
    Utils.showSpinner();
    let options = {
      'sl_id': this.semanticId,
      'report_name': data.name,
      "created_by": this.userId,
      'modified_by': this.userId,
      'description': data.desc,
      'is_dqm': true,
      'extract_flag': [1, 2],
      'user_id': [this.userId],
      'dl_list': ['dl_list_5'],
      'sl_tables_id': this.getTableIds(),
      'sheet_name': 'sheet01',
      'is_chart': true,
      'query_used': this.getFormula(),
      'color_hexcode': 'ffffff',
      'columns_used': this.getColumns(),
      'condition_flag': false,
      'condition_data': [],
      'calculate_column_flag': this.sharedDataService.isAppliedCaluclated(),
      'calculate_column_data': [this.sharedDataService.getCalculateData()]
    }

    this.formulaService.generateReport(options).subscribe(
      res => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toastrService.success(res['message']);
        this.router.navigate(['semantic/sem-reports/home']);
      },
      err => {
        Utils.hideSpinner();
        Utils.closeModals();
        this.toastrService.error(err['message']['error']);
      }
    )
  }

  public getPreview() {
    // this.sharedDataService.setToggle(true);
  }

  public getFormula(){
    let formula = document.getElementById('formula').innerText;
    return formula;
  }
}