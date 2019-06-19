import { Component, OnInit, Input, Output, EventEmitter, SimpleChange} from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import Utils from '../../../../../utils';
declare var $: any;

@Component({
  selector: 'app-manage-parameters',
  templateUrl: './manage-parameters.component.html',
  styleUrls: ['./manage-parameters.component.css']
})
export class ManageParametersComponent implements OnInit {

  @Input() parameters;
  @Output() actionParam = new EventEmitter;
  originalParameters:any = [];
  public confirmText;
  public confirmHeader ;
  type;
  constructor() { }

  ngOnInit() {
    this.originalParameters = JSON.parse(JSON.stringify(this.parameters));
  }

  ngOnChanges(changes:  SimpleChange ) {
    this.reset();
    // if(changes[''])
    // console.log(changes,'changes');
    
  }

  deleteParameters() {
    Utils.closeModals();
    this.confirmHeader = 'Delete Parameter(s)';
    this.confirmText = "Are you sure you want to delete the parameter(s)?";
    this.type = 'param';
    $('#deleteReportModal').modal();
    this.actionParam.emit(this.originalParameters);
  }

  onSelectionParam(param, event) {
    if(event.checked) {
      param.isDisabled = true;
    }else {
      param.isDisabled = false;
    }
  }

  isChecked() {
    // return this.originalParameters.some((data) => data["isDisabled"]);
    let changeData = this.originalParameters;
    let isChanged = false;
    this.parameters.forEach(function (data, key) {
      if (!(changeData[key]["isDisabled"] == data["isDisabled"])) {
        isChanged = true;
      }
    });

    return isChanged;
  }

  disable() {
    this.actionParam.emit(this.originalParameters);
  }

  reset() {
    this.originalParameters = JSON.parse(JSON.stringify(this.parameters));
  }

}
