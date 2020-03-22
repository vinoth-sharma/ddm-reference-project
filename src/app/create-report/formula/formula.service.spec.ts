import { TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { FormulaService } from './formula.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { environment } from "../../../environments/environment";

describe('FormulaService', () => {

  let injector: TestBed;
  let formulaService: FormulaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ 
        imports:[HttpClientTestingModule],
        providers: [FormulaService]
       });
     injector = getTestBed();
     formulaService = injector.get(FormulaService); 
     httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(()=> {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: FormulaService = TestBed.get(FormulaService);
    expect(service).toBeTruthy();
  });

  it('should return expected generateReport method', fakeAsync(() => { 
      const expectedHeroes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      formulaService.generateReport(expectedHeroes).subscribe(res => {
        expect(res).toBe(res); 
      } );
      const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
        expect(request.url).toEqual(`${environment.baseUrl}reports/generate_report/`);
        expect(request.method).toBe('POST');
        return true;
      }); 

      request.flush(expectedHeroes);
      tick();
  }));

  it('should return expected createSheetToExistingReport method', fakeAsync(() => { 
    const expectedHeroes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      formulaService.createSheetToExistingReport(2).subscribe(res => {
        expect(res).toBe(res)
      });
    const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
      expect(request.url).toEqual(`${environment.baseUrl}reports/report_creation/`);
      expect(request.method).toBe('POST');
      return true;
    }); 
    request.flush(expectedHeroes);
    tick();    
  }));

  it('should return expected uploadReport method', fakeAsync(() => {
      const expectedHeroes = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      formulaService.uploadReport(2).subscribe(res => {
        expect(res).toBe(res); 
      } );

      const request = httpMock.expectOne((request: HttpRequest<any>) : any => {
        expect(request.url).toEqual(`${environment.baseUrl}reports/ddm_report_upload/`);
        expect(request.method).toBe('POST');
        return true;
      }); 
      request.flush(expectedHeroes);
      tick(); 
   }));

});



// {
//   'sl_id': 194
// 'report_name': "Ganesh"
// 'created_by': "LYC59J"
// 'modified_by': "LYC59J"
// 'description': "dsfy"
// 'is_dqm': false
// 'extract_flag': [1, 2]
// 'user_id': ["LYC59J"]
// 'dl_list': ["dl_list_5"]
// 'sl_tables_id': [2962]
// 'sl_custom_tables_id': []
// 'is_chart': true
// 'query_used': "SELECT T_2962.ALLOC_GRP_CD  FROM VSMDDM.VEHICLE_INFO T_2962  WHERE  ROWNUM  <= 1000   GROUP BY T_2962.ALLOC_GRP_CD "
// 'color_hexcode': "ffffff"
// 'columns_used': ["ALLOC_GRP_CD"]
// 'condition_flag': false
// 'conditions_data': []
// 'calculate_column_flag': false
// 'calculate_column_data': []
// 'sheet_json': {selected_tables: [{
//                                   'disabled': false
//                                   'tableId': 2962
//                                   'tableType': "Tables"
//                                   'columns': ["ALLOC_GRP_CD"]
//                                   'columnAlias': {}
//                                   'join': "",
//                                   'keys':[{'primaryKey': "", 'operation': "=", 'foreignKey': ""}],

//                                 }], calculated_fields: Array(0), aggregations: {…}, having: "", orderBy: Array(0), …}
// 'is_new_report': true
// 'report_list_id': 0
// 'request_id': "3150"
// 'sheet_id': 0
// 'is_copy_paste': undefined
// 'sheet_name': "Sheet_1"
// }
 