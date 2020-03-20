import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConditionsComponent } from './add-conditions.component';

describe('AddConditionsComponent', () => {
  let component: AddConditionsComponent;
  let fixture: ComponentFixture<AddConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('getTables() should fetch selected tables', () => {
  //   component.selectedTables = [];
  //   const result = [];
  //   fixture.detectChanges();
  //   expect(component.getTables()).toEqual(result);
  // });

  //  describe('searching from the list of users', function() {     sample for search
  //   it('sorts in descending order by default', function() {
  //     let users = ['jack', 'igor', 'jeff'];
  //     let searchResult = getSemanticList(users);
  //     expect(searchResult).toEqual(['Aneesha Biju']);
  //   });
  // });

// public getTables() {  //fetch selected tables
//   return this.selectedTables.map(element => {
//     return {
//       'name': element['table']['mapped_table_name'],
//       'id': element.tableId,
//       'alias': element['select_table_alias']
//     };
//   });
// }
});
