import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ShareReportService } from '../share-reports/share-report.service.js';
import Utils from "../../utils";
import { ToastrService } from "ngx-toastr";
declare var $: any;

@Component({
  selector: 'app-show-signature',
  templateUrl: './show-signature.component.html',
  styleUrls: ['./show-signature.component.css']
})
export class ShowSignatureComponent implements  OnChanges {
  @Input() inputParams;
  previousData = '';
  saveName = '';
  isInvalid = false;
  signCreate = false;
  newSignature;
  @Output() create = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();

  config = {
    toolbar: [
      ['bold','italic','underline','strike'],
      ['blockquote'],
      [{'list' : 'ordered'}, {'list' : 'bullet'}],
      [{'script' : 'sub'},{'script' : 'super'}],
      [{'size':['small',false, 'large','huge']}],
      [{'header':[1,2,3,4,5,6,false]}],
      [{'color': []},{'background':[]}],
      [{'font': []}],
      [{'align': []}],
      ['clean'],
      ['image']
    ]
  };
  styling = {
    maxHeight:'300px',
    height: 'auto'
  };

  constructor(private uploadService: ShareReportService,
              private toasterService: ToastrService) {}

  ngOnChanges() {
    this.previousData = this.inputParams.signature_html;
    this.newSignature = false;
    if(this.inputParams && this.inputParams.signature_name === 'Create new signature') 
        this.newSignature = true;
  }

  isSignatureValid() {
    return !(this.inputParams.signature_html && this.inputParams.signature_html.replace(/\s/g, '').length &&
              this.saveName && this.saveName.replace(/\s/g, '').length);
  }

  isSignatureCreateValid() {
    return !(this.inputParams.signature_html && this.inputParams.signature_html.replace(/\s/g, '').length);
  }

  isSaveName() { 
   return (this.saveName && !this.saveName.replace(/\s/g, '').length);
  }

  createNewSignature() {
    this.isInvalid = false;
    let obj = {};
    obj["html"] = this.inputParams.signature_html;
    obj["userId"] = "USER1";
    obj["name"] = this.saveName;
    this.create.emit(obj);
    this.initialize();
  } 

  useSignature() {
    if (this.previousData !== this.inputParams.signature_html) {
      let options = {};
      options["id"] = this.inputParams.signature_id;
      options["html"] = this.inputParams.signature_html;
      options["userId"] = "USER1";
      options["name"] = this.inputParams.signature_name;
      options["type"] = 'existing';
      this.update.emit(options);
    }
  }

  initialize() {
    this.inputParams.signature_html = '';
    this.saveName = '';
  }

  deleteSignatures() {
    Utils.showSpinner();
    this.uploadService.delSignature( this.inputParams.signature_id).subscribe(response => {
      this.delete.emit( this.inputParams.signature_id);
      this.toasterService.success("Signature deleted successfully")
      $('#signature-schedular').modal('hide');
    }, error => {
      this.toasterService.error("There seems to be an error. Please try again later.");
    });
  }

  refresh() {
    if(this.newSignature) this.initialize();
  }
}

