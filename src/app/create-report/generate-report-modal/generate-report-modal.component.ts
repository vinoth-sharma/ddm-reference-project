import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-generate-report-modal',
  templateUrl: './generate-report-modal.component.html',
  styleUrls: ['./generate-report-modal.component.css']
})
export class GenerateReportModalComponent implements OnInit {

  @ViewChild("nameRef") nameInput;
  @ViewChild("descRef") descInput;
  public duplicate:boolean;
  @Output() public saveData = new EventEmitter();

  constructor(private sharedDataService:SharedDataService) { }

  ngOnInit() {
  }

  ngOnChanges(){
    this.reset();
  }

   /**
   * reset data
   */
  public reset() {
    this.nameInput.nativeElement.value = "";
    this.descInput.nativeElement.value = "";
    this.duplicate = false;
  }

  public checkDuplicate(value){
      let list = this.sharedDataService.getReportList();
      this.duplicate = list.map(col => col.trim())
      .includes(value.trim());

      // if(dupList.length >0){
      //   this.duplicate = true;
      // }else{
      //   this.duplicate = false;
      // }
  }

  /**
   * isEnable
   */
  public isEnable() {
    return (this.nameInput.nativeElement.value && this.descInput.nativeElement.value && !this.duplicate);
  }

  /**
   * update Data
   */
  public updateData(){
    let data = {
      'name':this.nameInput.nativeElement.value,
      'desc':this.descInput.nativeElement.value
    }
    this.saveData.emit(data);
  }
}
