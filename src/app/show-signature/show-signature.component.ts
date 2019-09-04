import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import ClassicEditor from '../../assets/cdn/ckeditor/ckeditor.js';
import { CustomUploadAdapter } from '../share-reports/custom-upload-adapter';
import { ShareReportService } from '../share-reports/share-report.service.js';
let uploadServiceInstance: ShareReportService;
import Utils from "../../utils";
import { ToastrService } from "ngx-toastr";
declare var $: any;

@Component({
  selector: 'app-show-signature',
  templateUrl: './show-signature.component.html',
  styleUrls: ['./show-signature.component.css']
})
export class ShowSignatureComponent implements OnInit, AfterViewInit {

  public Editor = ClassicEditor;
  private editor;
  @Input() sign: string;
  @Input() signNames;
  @Input() editorData;
  createData;
  @Input() selectedId: number;
  @Input() signSelected;
  public saveName: string;
  public isInvalid: boolean = false;
  public signCreate: boolean = false;
  public editorConfig = {
    extraPlugins: [this.MyUploadAdapterPlugin],
    removePlugins : ['Link','MediaEmbed','Iframe','Save','ImageTextAlternativeUI','ImageTextAlternative']
  };
  @Output() create = new EventEmitter();
  @Output() update = new EventEmitter();
  @Output() delete = new EventEmitter();
  response: { data: { file_path: string, image_id: number }, message: string, status: number } | null;
  defaultError = "There seems to be an error. Please try again later.";

  constructor(private uploadService: ShareReportService,
    private toasterService: ToastrService) {
    uploadServiceInstance = uploadService;
    this.uploadService.imageData.subscribe({
      next: (tableList: any) => {
        this.response = tableList;
      }, error: (error) => {
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    ClassicEditor.create(document.querySelector('#ckEditor'), this.editorConfig).then(editor => {
      this.editor = editor;
      editor.setData(this.editorData);
    })
      .catch(error => {
        //console.log('Error: ', error);
      });
  }

  ngOnChanges() {
    if (this.editor && this.editorData) {
      this.editor.setData(this.editorData);
    }
  }

  isSignatureValid() {
    return !(this.editor.getData() && this.saveName && !this.uploadService.isUploadInProgress && !this.signNames.includes(this.saveName));
  }

  isSignatureCreateValid() {
    return !(this.editor && this.editor.getData() !== this.editorData && this.editor.getData() && !this.uploadService.isUploadInProgress);
  }

  // && this.editor.getData() && !this.uploadService.isUploadInProgress

  isSaveName() { 
   return (this.saveName && this.signNames.includes(this.saveName));
  }

  createNewSignature() {
    this.isInvalid = false;
    this.createData = this.editor.getData();
    let obj = {};
    obj["html"] = this.createData;
    obj["userId"] = "USER1";
    obj["name"] = this.saveName;
    if (this.response && obj['html'].includes('<img src=')) {
      obj["imageId"] = this.response.data.image_id;
    } 
    this.create.emit(obj);
    this.response = { data: { file_path: '', image_id: null }, message: '', status: null };
    this.initialCreate();
  }

  initialExisting() {
    if (this.editor) {
      this.editor.setData(this.editorData);
    }
  }

  useSignature() {
    // let output = this.editor.getData();
    const output = "<script src='src/assets/cdn/ckeditor/ckeditor.js' type='text'></script>"+this.editor.getData();
    console.log(output);
    if (this.editorData !== output) {
      let options = {};
      options["id"] = this.selectedId;
      options["html"] = output;
      options["userId"] = "USER1";
      options["name"] = this.sign;
      options["type"] = 'existing';
      if (this.response && options['html'].includes('<img src=')) {
        options["imageId"] = this.response.data.image_id;
      }
      this.update.emit(options);
      this.initialExisting();
      this.initialCreate();
    }
  }

  initialCreate() {
    if (this.editor) {
      this.editor.setData('');
    }
    this.saveName = '';
  }

  public deleteSignatures() {
    Utils.showSpinner();
    this.uploadService.delSignature(this.selectedId).subscribe(response => {
      this.delete.emit(this.selectedId);
      this.toasterService.success("Signature deleted successfully")
      $('#signature').modal('hide');
    }, error => {
      this.toasterService.error(this.defaultError);
    });
    this.initialCreate();
  };

  MyUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader, uploadServiceInstance);
    };
  }
}

