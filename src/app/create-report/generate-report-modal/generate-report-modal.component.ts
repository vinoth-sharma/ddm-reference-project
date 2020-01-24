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
  // isDqmReport:  FormControl = new FormControl();
  public isDqmRecieved: boolean;
  currentName: string = '';
  currentDesc: string = '';
  public cloningRequestIds :any = [];
  public cloningState : boolean = false;
  public selectedCloneId : any;
  // currentDqm:boolean ;

  constructor(
    private sharedDataService:SharedDataService,
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.saveAsName.setErrors(null);
    this.sharedDataService.saveAsDetails.subscribe(data =>{
        this.saveAsName.setValue(data.name);
        this.descForm.setValue(data.desc);
        this.cloningRequestIds = data.requestDetailsForCloning;
        // this.sharedDataService.setCloningProcessState(true);
        this.cloningState = true;
        // this.cloningState = true;
        // this.currentDqm =  data.isDqm;
        // this.isDqmReport.setValue(data.isDqm ? data.isDqm.toString():"false");
        if(this.fromPath === 'create-report'){
          this.currentName = data.name;
          this.currentDesc = data.desc;
        }else{
          this.currentName = '';
          this.currentDesc = '';
        }
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
      // this.isDqmReport.setValue(this.currentDqm);
    }else{
      this.saveAsName.setValue("");
      this.descForm.setValue("");
    }
  }

  public checkDuplicate(value){
      let list = this.sharedDataService.getReportList();
      
      if(list.indexOf(value) > -1 && this.currentName.toLowerCase() !== value.toLowerCase()){
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
      'desc':this.descForm.value,
      'cloneId': this.selectedCloneId
      // 'isDqm': this.isDqmReport.value
      // 'isDqm': this.currentDqm
    }
    console.log("Updating the data object details",data);
    
    this.saveData.emit(data);
  }

  // public updateCloneId(event : any){
  //   console.log(" updateCloneId() event details : ",event);
  //   this.selectedCloneId =
  // }
}
