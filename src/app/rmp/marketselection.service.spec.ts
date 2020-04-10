import { async, TestBed,inject } from '@angular/core/testing';
import { MarketselectionService } from './marketselection.service';

describe('MarketselectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketselectionService = TestBed.get(MarketselectionService);
    expect(service).toBeTruthy();
  });

  it('should check changeSelection method', async(inject( [MarketselectionService], 
    ( marketselectionService ) => { 
      marketselectionService.changeSelection(2);
      marketselectionService.selectionSource.subscribe(result =>
        expect(result).toEqual(2));
    })))
});
