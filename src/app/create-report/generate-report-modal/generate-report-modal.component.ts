import { Component, OnInit, Output, EventEmitter, SimpleChange, Input } from '@angular/core';
import { SharedDataService } from '../shared-data.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-report-modal',
  templateUrl: './generate-report-modal.component.html',
  styleUrls: ['./generate-report-modal.component.css']
})
export class GenerateReportModalComponent implements OnInit {

  @Output() public saveData = new EventEmitter();
  @Input() fromPath: any ;

  saveAsName: FormControl = new FormControl();
  descForm:  FormControl = new FormControl();
  currentName: string = '';
  currentDesc: string = '';

  constructor(
    private sharedDataService:SharedDataService,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.saveAsName.setErrors(null);
    this.sharedDataService.saveAsDetails.subscribe(data =>{
        this.saveAsName.setValue(data.name);
        this.descForm.setValue(data.desc);
        if(this.fromPath === 'create-report'){
          this.currentName = data.name;
          this.currentDesc = data.desc;
        }else{
          this.currentName = '';
          this.currentDesc = '';
        }
        // this.checkDuplicate(data.name);
    })

    this.saveAsName.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        this.checkDuplicate(value);
      });
  }

   /**
   * reset data
   */
  public reset() {
    if(this.activateRoute.snapshot.paramMap.get('id')){
      this.saveAsName.setValue(this.currentName);
      this.descForm.setValue(this.currentDesc);
    }else{
      this.saveAsName.setValue("");
      this.descForm.setValue("");
    }
  }

  public checkDuplicate(value){
      let list = this.sharedDataService.getReportList();
      
      if(list.indexOf(value.trim()) > -1 && this.currentName.toLowerCase() !== value.toLowerCase()){
        this.saveAsName.setErrors({'incorrect': false})
      }else{
        this.saveAsName.setErrors(null)
      }
  }

  /**
   * update Data
   */
  public updateData(){
    let data = {
      'name':this.saveAsName.value,
      'desc':this.descForm.value
    }
    this.saveData.emit(data);
  }
}
