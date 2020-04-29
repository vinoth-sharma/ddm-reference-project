import { TestBed } from '@angular/core/testing';

import { SharedDataService } from './shared-data.service';
import { Observable, of } from 'rxjs';

describe('SharedDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedDataService = TestBed.get(SharedDataService);
    expect(service).toBeTruthy();
  });


  //async
  it("set selected tables",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.selectedTables.subscribe(res=>{
      expect(res[0]).toEqual(jasmine.objectContaining({name:"test"}))
    })
    service.setSelectedTables([{name:"test"}]);

  })

  it("set condition json data",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setNewConditionData([{condition_id: 123}])
    expect(service.newConditionData[0]).toEqual(jasmine.objectContaining({condition_id: 123}))
  })

  it("get condition json data",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.newConditionData = [{condition_id: 123}];
    expect(service.getNewConditionData().data[0]).toEqual(jasmine.objectContaining({condition_id: 123}));
  })

  //async
  it("setCalcData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    let data1 = [{columnName: 'column1',formula:'formula1'}];
    service.setCalcData(data1);
    service.calDataForCondition.subscribe(res=>{
      expect(res[0]).toEqual(jasmine.objectContaining({name : 'column1',formula:'formula1'}))
    });
  })

  it("setFormulaCalculatedData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setFormulaCalculatedData([{type:"calc"},{type:"calc1"}]);
    expect(service.formulaCalculatedData[0]).toEqual(jasmine.objectContaining({type:"calc"}));
  })

  it("getFormulaCalculatedData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.formulaCalculatedData = [{type:"calc"},{type:"calc1"}];
    expect(service.getFormulaCalculatedData()[0]).toEqual(jasmine.objectContaining({type:"calc"}));
  })

  it("setReportList function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setReportList([{report_id: 1},{report_id: 12}])
    expect(service.reportList[0]).toEqual(jasmine.objectContaining({report_id: 1}));
  })

  it("getReportList function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setReportList([{report_id: 1},{report_id: 12}])
    expect(service.getReportList()[0]).toEqual(jasmine.objectContaining({report_id: 1}));
  })

  it("setCalculatedKeyData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setCalculatedKeyData([{calc_id: 1},{calc_id: 12}])
    expect(service.keyChips[1]).toEqual(jasmine.objectContaining({calc_id: 12}));
  })

  it("getCalculatedKeyData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setCalculatedKeyData([{calc_id: 1},{calc_id: 12}])
    expect(service.getCalculatedKeyData()[0]).toEqual(jasmine.objectContaining({calc_id: 1}));
  })

  it("setNextClicked function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.isNextClicked.subscribe(res=>{
      expect(res).toEqual(true);
    })
    service.setNextClicked(true);
  })

  it("getNextClicked function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    expect(typeof service.getNextClicked()).toEqual(typeof of(true))
  })

  it("setAggregationData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setAggregationData({type:"sample"},"test");
    expect(service.aggregationData).toEqual(jasmine.objectContaining({type:"sample"}))
    expect(service.aggregationToken).toEqual("test")
  })

  it("getAggregationData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setAggregationData({type:"sample"},"test");
    expect(service.getAggregationData()).toEqual(jasmine.objectContaining({data:{type:"sample"},aggregation:"test"}))
  })

  it("getSaveAsDetails function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    expect(typeof service.getSaveAsDetails()).toEqual(typeof of([]))
  })

  it("setSaveAsDetails function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.saveAsDetails.subscribe(res=>{
      expect(res).toEqual("test");
    })
    service.setSaveAsDetails("test");
  })

  it("setExistingColumns function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setExistingColumns([{column_id: 1},{column_id: 12}])
    expect(service.existingColumns[0]).toEqual(jasmine.objectContaining({column_id: 1}));
  })

  it("getExistingColumns function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setExistingColumns([{column_id: 1},{column_id: 12}])
    expect(service.getExistingColumns()[0]).toEqual(jasmine.objectContaining({column_id: 1}));
  })

  it("setOrderbyData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setOrderbyData([{column_id: 1},{column_id: 12}])
    expect(service.orderbyData[0]).toEqual(jasmine.objectContaining({column_id: 1}));
  })

  it("getOrderbyData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setOrderbyData([{column_id: 1},{column_id: 12}])
    expect(service.getOrderbyData()[0]).toEqual(jasmine.objectContaining({column_id: 1}));
  })

  it("setHavingData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setHavingData([{column_id: 1},{column_id: 12}])
    expect(service.havingData[0]).toEqual(jasmine.objectContaining({column_id: 1}));
  })

  it("getHavingData function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setHavingData([{column_id: 1},{column_id: 12}])
    expect(service.getHavingData()[0]).toEqual(jasmine.objectContaining({column_id: 1}));
  })

  it("setRequestId function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setRequestId(1);
    expect(service.requestId).toEqual(1);
  })

  it("setRequestIds function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setRequestIds(1);
    expect(service.requestId).toEqual(1);
  })

  it("getRequestId function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setRequestId(1);
    expect(service.getRequestId()).toEqual(1);
  })

  it("setEditRequestId function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setEditRequestId(true);
    expect(service.isReqIdSet).toEqual(true);
  })

  it("getEditRequestId function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setEditRequestId(true);
    expect(service.getEditRequestId()).toEqual(true);
  });

  it("setSheetJSON function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setSheetJSON({type: "sample",data: []});
    expect(service.sheetJson).toEqual(jasmine.objectContaining({type: "sample",data: []}));
  })

  it("getSheetJSON function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setSheetJSON({type: "sample",data: []});
    expect(service.getSheetJSON()).toEqual(jasmine.objectContaining({type: "sample",data: []}));
  })

  it("setReportConditionFlag function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setReportConditionFlag(true);
    expect(service.isNewSheetExistingReport).toEqual(true);
  })

  it("getReportConditionFlag function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setReportConditionFlag(true);
    expect(service.getReportConditionFlag()).toEqual(true);
  });

  it("setObjectExplorerPathValue function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setObjectExplorerPathValue(true);
    expect(service.showSelectReqIdBtn).toEqual(true);
  })

  it("getObjectExplorerPathValue function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setObjectExplorerPathValue(true);
    expect(service.getObjectExplorerPathValue()).toEqual(true);
  });

  it("setEcsStatus function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setEcsStatus(true);
    expect(service.ecsUpload).toEqual(true);
  });

  it("setTablesDataFromSideBar function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setTablesDataFromSideBar({type: "sample",data: []});
    expect(service.allTablesData).toEqual(jasmine.objectContaining({type: "sample",data: []}));
  })

  it("getTablesDataFromSideBar function",()=>{
    const service: SharedDataService = TestBed.get(SharedDataService);
    service.setTablesDataFromSideBar({type: "sample",data: []});
    expect(service.getTablesDataFromSideBar()).toEqual(jasmine.objectContaining({type: "sample",data: []}));
  })
});
