import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import Utils from "../../../../utils";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { NgToasterComponent } from "../../../custom-directives/ng-toaster/ng-toaster.component";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";

@Component({
  selector: 'app-reference-doc',
  templateUrl: './reference-doc.component.html',
  styleUrls: ['./reference-doc.component.css']
})
export class ReferenceDocComponent implements OnInit, AfterViewInit {
  public content;
  public get_url;
  public naming: Array<object>;
  public file = null;
  public editMode: Boolean;
  public changeDoc = false;
  public editid;
  public textChange = false;
  public document_details = {
    "title": "",
    "url": "",
    "admin_flag": false
  }
  public document_detailsEdit = {
    "ddm_rmp_desc_text_reference_documents_id": "",
    "title": "",
    "url": "",
    "admin_flag": false
  }

  public filesList;
  public contents;
  public enable_edits = false
  public editModes = false;
  public original_content;
  public isChecked;
  public namings: string = "Loading";
  public delete_document_details;
  public user_role: string;
  public isRef = {
    'docs': []
  };
  public readOnlyContentHelper = true;
  public config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['image']
    ]
  };
  public toolbarTooltips = {
    'font': 'Select a font',
    'size': 'Select a font size',
    'header': 'Select the text style',
    'bold': 'Bold',
    'italic': 'Italic',
    'underline': 'Underline',
    'strike': 'Strikethrough',
    'color': 'Select a text color',
    'background': 'Select a background color',
    'script': {
      'sub': 'Subscript',
      'super': 'Superscript'
    },
    'list': {
      'ordered': 'Numbered list',
      'bullet': 'Bulleted list'
    },
    'indent': {
      '-1': 'Decrease indent',
      '+1': 'Increase indent'
    },
    'direction': {
      'rtl': 'Text direction (right to left | left to right)',
      'ltr': 'Text direction (left ro right | right to left)'
    },
    'align': 'Text alignment',
    'link': 'Insert a link',
    'image': 'Insert an image',
    'formula': 'Insert a formula',
    'clean': 'Clear format',
    'add-table': 'Add a new table',
    'table-row': 'Add a row to the selected table',
    'table-column': 'Add a column to the selected table',
    'remove-table': 'Remove selected table',
    'help': 'Show help'
  };


  constructor(private django: DjangoService, private auth_service: AuthenticationService,
    private toastr: NgToasterComponent,
    private dataProvider: DataProviderService) {
    this.editMode = false;

    dataProvider.currentFiles.subscribe(ele => {
      if (ele) {
        this.isRef['docs'] = []
        this.filesList = ele['list'];
        this.filesList.forEach(ele => {
          if (ele['flag'] == 'is_ref') {
            this.isRef['docs'].push(ele);
          }
        })
      }
    })
    dataProvider.currentlookUpTableData.subscribe(element => {
      this.content = element;
    })
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
      }
    })
  }

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_text = {
    "ddm_rmp_desc_text_id": 8,
    "module_name": "Help_RefDoc",
    "description": ""
  }

  ngOnInit() {
    Utils.showSpinner();
    let temp = this.content['data'].desc_text_reference_documents;
    this.naming = temp;
    let ref = this.content['data']['desc_text']
    let temps = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 8; 
    })
    if (temps) {
      this.original_content = temps.description;
    }
    else { this.original_content = "" }
    this.namings = this.original_content;
    Utils.hideSpinner();
  }

  ngAfterViewInit() {
    this.showTooltips();
  }

  // quill editor buttons tooltips display
  public showTooltips() {
    let showTooltip = (which, el) => {
      var tool: any;
      if (which == 'button') {
        tool = el.className.replace('ql-', '');
      }
      else if (which == 'span') {
        tool = el.className.replace('ql-', '');
        tool = tool.substr(0, tool.indexOf(' '));
      }
      if (tool) {
        if (tool === 'blockquote') {
          el.setAttribute('title', 'blockquote');
        }
        else if (tool === 'list' || tool === 'script') {
          if (this.toolbarTooltips[tool][el.value])
            el.setAttribute('title', this.toolbarTooltips[tool][el.value]);
        }
        else if (el.title == '') {
          if (this.toolbarTooltips[tool])
            el.setAttribute('title', this.toolbarTooltips[tool]);
        }
        //buttons with value
        else if (typeof el.title !== 'undefined') {
          if (this.toolbarTooltips[tool][el.title])
            el.setAttribute('title', this.toolbarTooltips[tool][el.title]);
        }
        //defaultlsdfm,nxcm,v vxcn
        else
          el.setAttribute('title', this.toolbarTooltips[tool]);
      }
    };

    let toolbarElement = document.querySelector('.ql-toolbar');
    if (toolbarElement) {
      let matchesButtons = toolbarElement.querySelectorAll('button');
      for (let i = 0; i < matchesButtons.length; i++) {
        showTooltip('button', matchesButtons[i]);
      }
      let matchesSpans = toolbarElement.querySelectorAll('.ql-toolbar > span > span');
      for (let i = 0; i < matchesSpans.length; i++) {
        showTooltip('span', matchesSpans[i]);
      }
    }
  }

  public upload(isChecked) {
    if ($('#uploadCheckbox').is(':checked')) {
      $('#document-url').attr('disabled', 'disabled');
      $('#attach-file1').removeAttr('disabled');
      (<HTMLInputElement>document.getElementById('document-url')).value = "";
    }
    else {
      $('#document-url').removeAttr('disabled');
      $('#attach-file1').attr('disabled', 'disabled');
      $("#attach-file1").val('');
      (<HTMLInputElement>document.getElementById('document-url')).value = "";
    }
  }

  public enableUpdateData = false;

  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner();
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_text['description'] = this.namings;
      $('#edit_button').show();
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
        let temp_desc_text = this.content['data']['desc_text'];
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 8) {
            temp_desc_text[index] = this.description_text;
          }
        })
        this.content['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.content);
        this.editModes = false;
        this.ngOnInit();
        this.original_content = this.namings;
        Utils.hideSpinner();
        this.toastr.success("Updated Successfully");
      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Data not Updated")
      })
    } else {
      this.toastr.error("please enter the data");
    }
  }

  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_content;
  }

  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_content;
  }

  public content_edit() {
    this.editMode = false;
  }

  public editTrue() {
    this.editMode = !this.editMode;
  }

  public getLink(index) {
    Utils.showSpinner();
    this.django.get_doc_link(index).subscribe(ele => {
      var url = ele['data']['url']
      Utils.hideSpinner();
      window.location.href = url
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server Error");
    })
  }

  public url() {
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();

    if (link_url != "") {
      $("#attach-file1").attr('disabled', 'disabled');
      $("#upload-doc").attr('disabled', 'disabled');
    }
    else {
      $("#attach-file1").removeAttr('disabled');
      $("#upload-doc").removeAttr('disabled');
    }
  }

  public doc() {
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    this.url();
    if (upload_doc != null) {
      $("#document-url").attr('disabled', 'disabled');
    }
    if (upload_doc == null) {
      $("#document-url").removeAttr('disabled');
    }
  }

  public addDocument() {
    this.document_details = {
      "title": "",
      "url": "",
      "admin_flag": false   
    }
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString(); 
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    let duplicateName = this.naming.find(ele => (ele['title'] == link_title));
    let dupeFileName = this.isRef.docs.find(item => item.uploaded_file_name == link_title)
    
    if (!this.editid && (duplicateName || dupeFileName)) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Document name can't be same</h5>";
      document.getElementById("errorTrigger").click()
    } else if (link_title == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if (link_title != "" && link_url == "" && upload_doc == undefined) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if (link_title != "" && link_url != "" && upload_doc == undefined) {
      $("#close_modal:button").click()
      Utils.showSpinner();
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      if (this.editid)
        this.document_details["ddm_rmp_desc_text_reference_documents_id"] = this.editid;
      this.document_details["title"] = document_title;
      this.document_details["url"] = document_url;
      this.django.ddm_rmp_reference_documents_post(this.document_details).subscribe(response => {
        Utils.showSpinner();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_reference_documents;
          if (this.editid) this.toastr.success("Document updated");
          else this.toastr.success("New document added");
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.editid = undefined;
          Utils.hideSpinner();
        }, err => {
          Utils.hideSpinner();
          this.toastr.error("Server problem encountered");
        })

      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Server problem encountered");
      });
      this.naming.push(this.document_details);
    }
    else if (link_title != "" && upload_doc != undefined && link_url == "") {
      $("#close_modal:button").click()
      this.files()
    }
    else if (link_title != "" && upload_doc != null && link_url != "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select one, either Url or Upload</h5>";
      document.getElementById("errorTrigger").click()
    }
  }

  public deleteDocument(id: number, index: number) {
    Utils.showSpinner();
    this.django.ddm_rmp_reference_documents_delete(id).subscribe(response => {
      document.getElementById("editable" + index).style.display = "none"
      Utils.hideSpinner();
      this.toastr.success("Document deleted successfully");
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server problem encountered");
    })
  }

  public delete_upload_file(id, index) {
    Utils.showSpinner();
    this.django.delete_upload_doc(id).subscribe(res => {
      document.getElementById("upload_doc" + index).style.display = "none"
      Utils.hideSpinner();
      this.toastr.success("Document deleted successfully");
    }, err => {
      Utils.hideSpinner();
      this.toastr.error("Server problem encountered");
    })
  }

  public editDoc(id, val, url) {
    this.editid = id;
    this.changeDoc = true;
    (<HTMLInputElement>document.getElementById('document-name')).value = val;
    (<HTMLInputElement>document.getElementById('document-url')).value = url;
  }

  public NewDoc() {
    this.editid = undefined;
    (<HTMLInputElement>document.getElementById('document-name')).value = "";
    (<HTMLInputElement>document.getElementById('document-url')).value = "";
    (<HTMLInputElement>document.getElementById('uploadCheckbox')).checked = false;
    this.upload("")
  }

  public files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    var formData = new FormData();
    formData.append('file_upload', this.file);
    formData.append('uploaded_file_name', document_title);
    formData.append('flag', "is_ref");
    formData.append('type', 'rmp');

    Utils.showSpinner();
    this.django.ddm_rmp_file_data(formData).subscribe(response => {
      this.django.get_files().subscribe(ele => {
        this.filesList = ele['list'];
        if (this.filesList) {
          this.dataProvider.changeFiles(ele)
        }
      })
      Utils.hideSpinner();
      $("#document-url").removeAttr('disabled');
      $('#uploadCheckbox').prop('checked', false);
      $("#attach-file1").val('');
      this.toastr.success("Uploaded Successfully");
    }, err => {
      Utils.hideSpinner();
      $("#document-url").removeAttr('disabled');
      $("#attach-file1").val('');
      if (err && err['status'] === 400)
        this.toastr.error("Submitted file is empty");
      else
        this.toastr.error("Server Error");
      $('#uploadCheckbox').prop('checked', false);
    });
  }

  public editDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "" || link_url == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
    } else {
      $("#close_modal:button").click()
      Utils.showSpinner();
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();

      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      this.document_detailsEdit["ddm_rmp_desc_text_reference_documents_id"] = this.editid;
      this.document_detailsEdit["title"] = document_title;
      this.document_detailsEdit["url"] = document_url;

      this.django.ddm_rmp_reference_documents_put(this.document_detailsEdit).subscribe(response => {
        Utils.showSpinner();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_reference_documents;
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.changeDoc = false;
          Utils.hideSpinner();
          this.toastr.success("Document updated successfully");
        }, err => {
          Utils.hideSpinner();
          this.toastr.error("Server problem encountered")
        })

      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Server problem encountered");
      });
    }
  }

}