import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SharedDataService {

  private selectedTables = [];
  private join: any;
  
  // SELECTED TABLE 
  // private selectedTables = [
  //   {
  //     "listType": "tables",
  //     "table": {
  //       "mapped_table_name": "CDC_VEH_ORDER_CHG_DTL",
  //       "view_to_admins": true,
  //       "sl_tables_id": 2283,
  //       "mapped_column_name": [
  //         "AFTER_VALUE",
  //         "%76",
  //         "DATA_ELMT_NAME",
  //         "DATA_SEQ_NUM",
  //         "EXTRACTION_TIMESTAMP",
  //         "EXT_TIME_EXTENSION",
  //         "IMAGE_TYPE",
  //         "OPERATION",
  //         "ORDER_NUM",
  //         "VEH_EVNT_CD",
  //         "VEH_EVNT_SEQ_NUM"
  //       ]
  //     },
  //     "columns": [
  //       "AFTER_VALUE"
  //     ]
  //   }
  // ]

  constructor() { }

  /**
   * setFormula
   */
  public setFormula() {

  };

  /**
   * getFormula
   */
  public getFormula() {

  };

  /**
   * getJoin
   */
  public getJoin() {
    return this.join;
  }

  /**
   * setJoin
   */
  public setJoin(join: any) {
    this.join = join;
  }

  /**
   * getSelectedTables
   */
  public getSelectedTables() {
    return this.selectedTables;
  }

  /**
   * setSelectedTables
   */
  public setSelectedTables(data: any) {
    this.selectedTables = data;
  }
}