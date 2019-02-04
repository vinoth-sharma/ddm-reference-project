import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { CalculatedColumnService } from "./calculated-column.service";
import Utils from "../../utils";

@Component({
  selector: 'app-calculated-column',
  templateUrl: './calculated-column.component.html',
  styleUrls: ['./calculated-column.component.css'],
})

export class CalculatedColumnComponent implements OnInit {

  @Input() table: any = {};

  public columns: any = [];
  public selectedColumns: any = [];
  public formulaColumns: any = [];
  public columnName: string;
  public tableName: string;
  public selected: string;
  public category: string;
  public isCollapsed: boolean;
  public semanticId: number;

  public functionsList = {
    'conversion': ['ASCIISTR', 'CHARTOROWID', 'COMPOSE', 'DECOMPOSE', 'HEXTORAW', 'RAWTOHEX', 'ROWIDTOCHAR', 'TO_DATE', 'TO_MULTI_BYTE', 'TO_NUMBER', 'TO_SINGLE_BYTE', 'TRANSLATE', 'UNISTR'],
    'date': ['ADD_MONTHS', 'CURRENT_DATE', 'DBTIMEZONE', 'LAST_DAY', 'MONTHS_BETWEEN', 'NEW_TIME', 'NEXT_DAY', 'NUMTODSINTERVAL', 'NUMTOYMINTERVAL', 'SECOND', 'SESSIONTIMEZONE', 'SYSDATE', 'DAY', 'EUL_DATE_TRUNC', 'HOUR', 'INTERVAL', 'INTERVALPRECISION', 'MINUTE', 'MONTH', 'TIMESTAMPADD', 'TIMESTAMPDIFF', 'YEAR'],
    'mathematical': ['*', '/', '+'],
    'logical': ['||', 'AND', 'NOT', 'OR'],
    'numeric': ['ABS', 'ACOS', 'ASIN', 'ATAN', 'ATAN2', 'CEIL', 'COS', 'COSH', 'EXP', 'FLOOR', 'LN', 'LOG', 'MOD', 'POWER', 'SIGN', 'SIN', 'SINH', 'SQRT', 'TAN', 'TANH', 'WIDTH_BUCKET'],
    'analytic': ['ASC', 'DESC', 'FOLLOWING', 'LAG', 'LEAD', 'NTILE', 'PERCENT_RANK', 'RANK', 'RATIO_TO_REPORT', 'RATIO_TO_REPORT', 'ROW_NUMBER', 'SUM', 'SUM_DISTINCT', 'FIRST_VALUE', 'LAST_VALUE'],
    'comparison': ['GREATEST', 'LEAST', '!=', '<', '<=', '<>', '>', '>=', '=', '^=', 'ALL', 'ANY', 'EXISTS', 'IN', 'NOT IN'],
    'character': ['ASCII', 'CHR', 'CONCAT', 'CONVERT', 'INITCAP', 'INSTR', 'INSTRB', 'LENGTH', 'LOWER', 'LPAD', 'LTRIM', 'NLS_INITCAP', 'NLS_LOWER', 'NLS_UPPER', 'NLSSORT', 'REPLACE', 'RPAD', 'RTRIM', 'SOUNDEX', 'SUBSTR', 'SUBSTRB', 'UPPER'],
    'aggregate': ['AVG', 'CORR', 'COUNT', 'COVAR_POP', 'COVAR_SAMP', 'CUME_DIST', 'DENSE_RANK', 'DENSE_RANK1', 'GROUP_ID', 'GROUPING', 'GROUPING_ID', 'MAX', 'MAX_DISTINCT', 'MIN', 'MIN_DISTINCT', 'PERCENTILE_CONT', 'PERCENTILE_DISC', 'STDDEV', 'STDDEV_POP', 'STDDEV_SAMP', 'VAR_POP', 'VAR_SAMP', 'VARIANCE'],
    'null-related': ['COALESCE', 'NULLIF', 'NVL', 'NVL2'],
    'encoding-decoding': ['DECODE', 'DUMP', 'VSIZE'],
    'environment-and-identifier': ['UID', 'USER', 'USERENV'],
    'regression': ['REGR_AVGX', 'REGR_AVGX1', 'REGR_AVGY', 'REGR_AVGY1', 'REGR_COUNT', 'REGR_COUNT1', 'REGR_INTERCEPT', 'REGR_INTERCEPT1', 'REGR_R2', 'REGR_R21', 'REGR_SLOPE', 'REGR_SLOPE1', 'REGR_SXX', 'REGR_SXX1', 'REGR_SXY', 'REGR_SXY1', 'REGR_SYY', 'REGR_SYY1'],
    'miscellaneous': ['-2', '-1', '2_Pass_Percentage', '2_Pass_Rank', 'AVG_DISTINCT', 'AVG_DISTINCT1', 'AVG1', 'AVG2', 'AVG3', 'BETWEEN', 'NOT BETWEEN', 'CASE', 'CORR1', 'COUNT_DISTINCT', 'COUNT_DISTINCT1', 'COUNT1', 'COUNT2', 'COUNT3', 'COVAR_POP1', 'COVAR_SAMP1', 'CURRENTROW', 'DENSERANKFIRST', 'DENSERANKLAST', 'ELSE', 'EUL_GET_ADDED_CONFIG', 'EUL_GET_ADDED_CONFIG 1', 'EUL_LIKE', 'EUL_NEQUAL', 'EUL_NLIKE', 'eul_trigger$post_save_document', 'EUL5_GET_ANALYZED', 'EUL5_GET_APPS_USERRESP', 'EUL5_GET_AUTOGEN_ITEM_NAME', 'EUL5_GET_COMPLEX_FOLDER', 'EUL5_GET_DATEHIER_TMPLT_NAME', 'EUL5_GET_EUL_DETAILS', 'EUL5_GET_FOLDERNAME', 'EUL5_GET_FORJ_ITEMID', 'EUL5_GET_HIER_EXPID', 'EUL5_GET_HIERLVL', 'EUL5_GET_HIERNODE_EXPID', 'EUL5_GET_HIERORD', 'EUL5_GET_ISITAPPS_EUL', 'EUL5_GET_ITEM', 'EUL5_GET_ITEM_NAME', 'EUL5_GET_JOIN', 'EUL5_GET_JOIN_EXPID', 'EUL5_GET_LINURL', 'EUL5_GET_OBJECT', 'EUL5_GET_OBJECT_NAME', 'EUL5_GET_SIMPLE_FOLDER', 'GLB', 'GREATEST_LB', 'GROUPINGSETS', 'IS NOT NULL', 'IS NULL', 'KEEP', 'LEAST_UB', 'LENGTHB', 'LIKE', 'NOT LIKE', 'LUB', 'MAX_DISTINCT1', 'MAX1', 'MAX2', 'MAX3', 'MIN_DISTINCT1', 'MIN1', 'MIN2', 'MIN3', 'NPASSBETWEEN', 'NPASSBETWEEN', 'NPASSBETWEENCOMP', 'NPASSORDERCOMP', 'NULL', 'NULLSFIRST', 'NULLSLAST', 'ORDER', 'OVER', 'OVER1', 'PARTITION', 'PERCENT_RANK1', 'PERCENTILE_CONT1', 'PERCENTILE_DISC1', 'PRECEDING', 'RANGE', 'RANK1', 'ROLLUP', 'ROUND1', 'ROUND2', 'ROWCOUNT', 'ROWID', 'ROWNUM', 'ROWS', 'STDDEV_DISTINCT', 'STDDEV_DISTINCT1', 'STDDEV_POP', 'STDDEV_POP1', 'STDDEV_SAMP', 'STDDEV_SAMP1', 'STDDEV1', 'STDDEV2', 'STDDEV3', 'SUM_DISTINCT1', 'SUM_SQUARES', 'SUM1', 'SUM2', 'SUM3', 'TO_CHAR1', 'TO_CHAR2', 'TO_CHAR3', 'TO_DATE', 'TO_LABEL', 'TRUNC1', 'TRUNC2', 'UNBOUNDEDFOLLOWING', 'UNBOUNDEDPRECEDING', 'VAR_POP1', 'VAR_SAMP1', 'VARIANCE_DISTINCT', 'VARIANCE_DISTINCT1', 'VARIANCE1', 'VARIANCE2', 'VARIANCE3', 'WHEN', 'WIDTH_BUCKET', 'WINDOW', 'WITHINGROUP', 'WITHINGROUPCOMPONENT'],
    'parentheses': ['(', ')'],
  }

  constructor(private activatedRoute: ActivatedRoute, private toasterService: ToastrService, private calculatedColumnService: CalculatedColumnService) {
    this.semanticId = this.activatedRoute.snapshot.data['semantic_id'];
  }

  ngOnInit() { }

  ngOnChanges() {
    this.reset();
  }

  public onSelect(selected: string) {
    if (selected) {
      if (this.isColumn(selected)) {
        if (!this.selectedColumns.includes(selected)) {
          this.selectedColumns.push(selected);
        }
        else {
          this.toasterService.error('Column already selected');
        }
      }
      else {
        this.toasterService.error('Please select a valid column');
      }
    }
    this.selected = '';
  }

  public isColumn(item: string) {
    return this.columns.includes(item);
  }

  public deleteSelectedColumn(index: number) {
    // get the selected item
    let selected = this.selectedColumns.splice(index, 1).shift();

    if (this.formulaColumns.includes(selected)) {
      this.deleteFormulaColumn();
    }
  }

  public deleteFormulaColumn() {
    this.formulaColumns = [];
  }

  public addToFormula(item: string) {
    // if selected item and last item in formulaColumns is same
    if (item === this.formulaColumns[this.formulaColumns.length - 1]) {
      this.toasterService.error('Please select a different column/function');
      return;
    }
    this.formulaColumns.push(item);
  }

  public addCalculatedColumn() {
    this.isCollapsed = false;

    let columns = this.formulaColumns.filter(item => {
      if (this.isColumn(item)) return item;
    });

    let data = {
      custom_table_name: this.tableName,
      parent_table: this.table['mapped_table_name'],
      calculated_column_name: this.columnName,
      sl_id: this.semanticId,
      mapped_column_name: columns,
      formula: this.formulaColumns.join(' ')
    }

    if (!this.validateColumnData(data)) return;

    Utils.showSpinner();
    this.calculatedColumnService.addColumn(data).subscribe(response => {
      this.toasterService.success(response['message']);
      Utils.hideSpinner();
      this.reset();
    }, error => {
      this.toasterService.error(error.message['error']);
      Utils.hideSpinner();
      this.reset();
    });
  }

  public validateColumnData(data: any) {
    if (!this.tableName || !this.columnName || !this.formulaColumns.length) {
      this.toasterService.error('Table name, column name and formula are mandatory fields');
      return false;
    }
    else if (data['custom_table_name'] && data['custom_table_name'] === this.table.mapped_table_name) {
      this.toasterService.error('Table name cannot be same as current table name');
      return false;
    }
    else if (data['calculated_column_name'] && this.isColumn(data['calculated_column_name'])) {
      this.toasterService.error('Column name cannot be an existing column name');
      return false;
    }
    return true;
  }

  public setCategory(category: string) {
    this.category = category;
  }

  public reset() {
    Utils.closeModals();
    this.columns = this.table && this.table['mapped_column_name'];
    this.selectedColumns = [];
    this.formulaColumns = [];
    this.columnName = '';
    this.tableName = '';
    this.selected = '';
    this.category = 'mathematical';
    this.isCollapsed = false;
  }

}