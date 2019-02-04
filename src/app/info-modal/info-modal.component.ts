import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SemanticReportsService } from 'src/app/semantic-reports/semantic-reports.service';
import Utils from "src/utils";
@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.css']
})
export class InfoModalComponent implements OnInit {
  public info:any;
  public tempInfo:any;
  public isEditable = false;
  public editBtnActive = true;
  public isUnchanged = true;
  @Input() reportInfo : any;
  @Output() saveOption = new EventEmitter();
  constructor(private toast:ToastrService,private sematicreportservice : SemanticReportsService) { }

  ngOnInit() {
  	this.info = this.reportInfo.description;
  	if(this.info == ''){
      this.info = "No Information available";
    }
    this.tempInfo = this.info;
  }
  
  public editInfo(){
    this.isEditable = true;
    this.editBtnActive = false;
    this.isUnchanged = false;
  }
  public saveChanges(){
  if(document.getElementById("textarea")){
    var val = document.getElementById("textarea").textContent;
    this.info = val;
  }
  var obj ={
  	"OriginalValue" : this.tempInfo,
  	"ChangedValue" : this.info,
  	"currentReport" : this.reportInfo
  }
  this.saveOption.emit(obj);
    
    // this.isEditable = false;
    // this.editBtnActive = true;
    
    // this.isUnchanged = true;
  }
  // public ngOnDestroy(){
  // this.info = this.tempInfo;
  //  this.isEditable = false;
  //  this.editBtnActive = true;
  //  this.isUnchanged = true;
  // }
  public reset(){
  this.info = this.tempInfo;
   this.isEditable = false;
   this.editBtnActive = true;
   this.isUnchanged = true;
  }

}
