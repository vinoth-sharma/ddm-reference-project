import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements OnInit {
  public info: any = '';
  public tempInfo: any = '';
  public isEditable = false;
  public editBtnActive = true;
  public isUnchanged = true;
  @Input() reportDescription: any = '';
  @Output() saveOption = new EventEmitter();
  public emittingObject: any = [];

  constructor() { }

  ngOnChanges() {
    // if(this.reportDescription == ''){
    //   this.reportDescription = "No information available";
    // }
    this.tempInfo = this.reportDescription;
  }

  ngOnInit() {
    // if(this.reportDescription == ''){
    //   this.reportDescription = "No information available";
    // }    
    this.tempInfo = this.reportDescription;
  }


  public editInfo() {
    this.isEditable = true;
    this.editBtnActive = false;
    this.isUnchanged = false;
  }

  public saveChanges() {
    if (document.getElementById("textarea")) {
      var val = document.getElementById("textarea")["value"];
      this.info = val;
    }
    var obj = {
      "OriginalValue": this.tempInfo,
      "ChangedValue": this.info
    }
    this.emittingObject = obj;
    this.saveOption.emit(obj);
  }

  public reset() {
    this.info = this.tempInfo;
    this.isEditable = false;
    this.editBtnActive = true;
    this.isUnchanged = true;
  }
}
