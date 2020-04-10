import { async, TestBed,inject } from '@angular/core/testing';
import { ReportCriteriaDataService } from './report-criteria-data.service';

describe('RepotCriteriaDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportCriteriaDataService = TestBed.get(ReportCriteriaDataService);
    expect(service).toBeTruthy();
  });

  it('should check setUserId method', async(inject( [ReportCriteriaDataService], 
    ( reportCriteriaDataService ) => { 
      reportCriteriaDataService.setUserId(10);
      expect(reportCriteriaDataService.user_id).toEqual(10);
      reportCriteriaDataService.getUserId().subscribe(res => 
        expect(res).toEqual(reportCriteriaDataService.user_id));
    })));

  it('should check setReportID method', async(inject( [ReportCriteriaDataService], 
    ( reportCriteriaDataService ) => { 
      reportCriteriaDataService.setReportID(10);
      expect(reportCriteriaDataService.reportID).toEqual(10);
      reportCriteriaDataService.getReportID().subscribe(res => 
        expect(res).toEqual(reportCriteriaDataService.reportID));
    })));

    it('should check getUserId method', async(inject( [ReportCriteriaDataService], 
      ( reportCriteriaDataService ) => { 
        reportCriteriaDataService.user_id = 10;
        reportCriteriaDataService.getUserId().subscribe(res => 
          expect(res).toEqual(reportCriteriaDataService.user_id));
      })));
  
    it('should check getReportID method', async(inject( [ReportCriteriaDataService], 
      ( reportCriteriaDataService ) => { 
        reportCriteriaDataService.reportID = 10;
        reportCriteriaDataService.getReportID().subscribe(res => 
          expect(res).toEqual(reportCriteriaDataService.reportID));
      })));

  
});
