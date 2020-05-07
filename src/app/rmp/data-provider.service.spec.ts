// Author : Bharath
import { TestBed } from '@angular/core/testing';

import { DataProviderService } from './data-provider.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DjangoService } from './django.service';
import { of } from 'rxjs';

describe('DataProviderService', () => {
  let service;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));
  beforeEach(() => {
    service = TestBed.get(DataProviderService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("sholud get files from django service", () => {
    let djangoService = TestBed.inject(DjangoService);
    let data = { key: "value" }
    spyOn(djangoService, "get_files").and.returnValue(of(data))
    service.getFiles();
    service.currentFiles.subscribe(item => {
      expect(item).toEqual(data)
    })
  })

  it("sholud pass data to Filedata subject", () => {
    let id = 1;
    service.changeFiles(id)
    service.currentFiles.subscribe(item => {
      expect(item).toEqual(id)
    })
  })

  it("sholud pass data to lookUpTableData subject", () => {
    let id = 1;
    service.changelookUpTableData(id)
    service.currentlookUpTableData.subscribe(item => {
      expect(item).toEqual(id)
    })
  })

  it("sholud pass data to lookUpTableData subject", () => {
    let id = 1;
    service.changelookUpData(id)
    service.currentlookUpTableData.subscribe(item => {
      expect(item).toEqual(id)
    })
  })

  it("sholud pass data to bacData subject", () => {
    let id = 1;
    service.changebacData(id)
    service.currentbacData.subscribe(item => {
      expect(item).toEqual(id)
    })
  })

  it("sholud pass data to intialLoad subject", () => {
    let id = 1;
    service.changeIntialLoad(id)
    service.currentIntialLoad.subscribe(item => {
      expect(item).toEqual(id)
    })
  })

  it("sholud get data from djangoservice and pass data to lookUpTableData subject", () => {
    let djangoService = TestBed.inject(DjangoService);
    let data = { key: "value" }
    spyOn(djangoService, "getLookupValues").and.returnValue(of(data))
    service.loadLookUpTableData()
    service.currentlookUpTableData.subscribe(item => {
      expect(item).toEqual(data)
    })
  })

  it("sholud get data from djangoservice and pass data to lookUpData subject", () => {
    let djangoService = TestBed.inject(DjangoService);
    let data = { key: "value" }
    spyOn(djangoService, "getNewData").and.returnValue(of(data))
    service.loadLookUpData()
    service.currentlookupData.subscribe(item => {
      expect(item).toEqual(data)
    })
  })

  // it("sholud get data from djangoservice and pass data to notifications subject", () => {
  //   let djangoService = TestBed.inject(DjangoService);
  //   let data = { data: "value" }
  //   spyOn(djangoService, "get_notifications").and.returnValue(of(data))
  //   service.loadNotifications()
  //   service.currentNotifications.subscribe(item => {
  //     // expect(item).toEqual("value")
  //   })
  // })

});
