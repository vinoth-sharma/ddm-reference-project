import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-generate-report-modal',
  templateUrl: './generate-report-modal.component.html',
  styleUrls: ['./generate-report-modal.component.css']
})
export class GenerateReportModalComponent implements OnInit {

  @ViewChild("nameRef") nameInput;
  @ViewChild("descRef") descInput;
  @Output() public saveData = new EventEmitter();

  constructor() { }

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
  }

  /**
   * isEnable
   */
  public isEnable() {
    return (this.nameInput.nativeElement.value && this.descInput.nativeElement.value);
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
