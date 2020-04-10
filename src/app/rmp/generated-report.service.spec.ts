import { TestBed } from '@angular/core/testing';

import { GeneratedReportService } from './generated-report.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
let service : GeneratedReportService
describe('GeneratedReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[HttpClientTestingModule]
  }));
  beforeEach(()=>{
    service = TestBed.get(GeneratedReportService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("should pass reportid to selectionSource subject",()=>{
    let id = 1;
    service.changeSelection(id)
    service.currentSelections.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to on_behalf subject",()=>{
    let id = "1";
    service.behalf_of(id)
    service.behalf_of_name.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to on_behalf_email subject",()=>{
    let id = "1";
    service.behalf_email(id)
    service.behalf_of_email.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to report_status subject",()=>{
    let id = "1";
    service.changeStatus(id)
    service.currentstatus.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to messageSource subject",()=>{
    let id = "1";
    service.changeMessage(id)
    service.currentMessage.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to divisionSelected subject",()=>{
    let id = [{key:"1"}];
    service.changeDivisionSelected(id)
    service.currentDivisionSelected.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to showOnBehalfOf subject",()=>{
    let id = false
    service.changeButtonStatus(id)
    service.buttonStatus.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to saveChanges subject",()=>{
    let id = false
    service.changeSavedChanges(id)
    service.savedSelection.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to saveUpdate subject",()=>{
    let id = false
    service.changeUpdate(id)
    service.updatedChanges.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to savedStatus subject",()=>{
    let id = false
    service.changeSaved(id)
    service.currentSaved.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })

  it("should pass data to disclaimerStatus subject",()=>{
    let id = false
    service.changeDisclaimer(id)
    service.currentDisclaimer.subscribe(item =>{
      expect(item).toEqual(id)
    })
  })
});
