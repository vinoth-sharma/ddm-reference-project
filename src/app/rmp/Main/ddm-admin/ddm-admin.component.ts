import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as Rx from "rxjs";

import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { AuthenticationService } from "src/app/authentication.service";
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { NgLoaderService } from 'src/app/custom-directives/ng-loader/ng-loader.service';
import { Router } from '@angular/router';

// Angular component migration by Bharath S
@Component({
  selector: 'app-ddm-admin',
  templateUrl: './ddm-admin.component.html',
  styleUrls: ['./ddm-admin.component.css']
})
export class DdmAdminComponent implements OnInit, AfterViewInit {

  public content: any;
  public naming: Array<object>;
  public editMode: Boolean;
  public enableUpdateData = false;
  public textChange = false;
  public deleteIndex = undefined
  public document_details = {
    "title": "",
    "url": "",
    "admin_flag": false
  }
  public document_detailsEdit = {
    "ddm_rmp_desc_text_admin_documents_id": "",
    "title": "",
    "url": "",
    "admin_flag": false
  }

  public file = null;
  public editid;
  public changeDoc = false;
  public delete_document_details;
  public user_role: string;
  public contents;
  public enable_edits = false
  public editModes = false;
  public original_content;
  public namings: string = "Loading";
  public filesList;
  public quillToolBarDisplay = [
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
  ];

  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_text = {
    "ddm_rmp_desc_text_id": 9,
    "module_name": "Help_DDMAdmin",
    "description": ""
  }

  public isAdmin = {
    'docs': []
  };

  public config = {
    toolbar: null
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

  public readOnlyContentHelper: boolean = true;

  constructor(private django: DjangoService, public auth_service: AuthenticationService,
    private toastr: NgToasterComponent, private spinner: NgLoaderService,private router: Router,
    public dataProvider: DataProviderService) {
    this.editMode = false;
    this.getCurrentFiles();
    this.getCurrentTableLookupData();
    this.getUserInfo();
  }

  public notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngOnInit() {
    this.initialiseData();
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

  public initialiseData() {
    this.spinner.show()

    let temp = this.content['data'].desc_text_admin_documents;
    this.spinner.hide()
    this.naming = temp;

    let ref = this.content['data']['desc_text']
    let temps = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 9;
    })
    if (temps) {
      this.original_content = temps.description;
    }
    else { this.original_content = "" }
    this.namings = this.original_content;
  }

  // get current files from server
  public getCurrentFiles() {
    this.dataProvider.currentFiles.subscribe(ele => {
      if (ele) {
        this.isAdmin['docs'] = []
        this.filesList = ele['list'];
        this.filesList.forEach(ele => {
          if (ele['flag'] == 'is_admin') {
            this.isAdmin['docs'].push(ele);
          }
        })
      }
    })
  }

  // subscribing to an observable in dataprovier service
  public getCurrentTableLookupData() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      this.content = element;
    })
  }

  // subscribing to an observable to get user info from auth_service
  public getUserInfo() {
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
        if (this.user_role == "Admin") this.config.toolbar = this.quillToolBarDisplay;
        else this.config.toolbar = false;
      }
    })
  }

  // getting links from server
  public getLink(ele) {
    this.spinner.show();
    this.django.get_doc_link(ele.file_id).subscribe(ele => {
      var url = ele['data']['url']
      window.location.href = url
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error("Server Error");
    })
  }

  // read data from quill editor
  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  // save changes made in help modal
  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      this.spinner.show();
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_text["description"] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
        let temp_desc_text = this.content['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 9) {
            temp_desc_text[index] = this.description_text
          }
        })
        this.content['data']['desc_text'] = temp_desc_text
        this.dataProvider.changelookUpTableData(this.content)
        this.editModes = false;
        this.ngOnInit()

        this.original_content = this.namings;
        this.toastr.success("Updated Successfully");
        this.spinner.hide()
      }, err => {
        this.spinner.hide()
        this.toastr.error("Data not Updated")
      })
    } else {
      this.toastr.error("please enter the data");
    }
  }

  // setting a few properties of component
  public edit_true() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_content;
  }

  // setting a few properties of component
  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_content;
  }

  // setting a few properties of component
  public content_edit() {
    this.editMode = false;
  }
  // setting a few properties of component
  public editTrue() {
    this.editMode = !this.editMode;
  }

  // setting a few properties of component
  public NewDoc() {
    this.editid = undefined;
    (<HTMLInputElement>document.getElementById('document-name')).value = "";
    (<HTMLInputElement>document.getElementById('document-url')).value = "";
    (<HTMLInputElement>document.getElementById('uploadCheckbox')).checked = false;
    this.upload("")
  }

  // used to disable/enable url input field
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
    }
  }

  // add document to server
  public addDocument() {
    this.document_details = {
      "title": "",
      "url": "",
      "admin_flag": false
    }
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let duplicateName = this.naming.find(ele => (ele['title'] == link_title));
    let dupeFileName = this.isAdmin.docs.find(item => item.uploaded_file_name == link_title)
    if ((duplicateName || dupeFileName)) {
      let eid = duplicateName ? duplicateName['ddm_rmp_desc_text_admin_documents_id'] : undefined;
      if (eid != this.editid || dupeFileName) {
        document.getElementById("errorModalMessage").innerHTML = "<h5>Document name can't be same</h5>";
        document.getElementById("errorTrigger").click();
        return
      }
    } if (link_title == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if (link_title != "" && link_url == "" && upload_doc == undefined) {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if (link_title != "" && link_url != "" && upload_doc == undefined) {
      $("#close_modal:button").click()
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      if (this.editid)
        this.document_details['ddm_rmp_desc_text_admin_documents_id'] = this.editid;
      this.document_details["title"] = document_title;
      this.document_details["url"] = document_url;
      this.django.ddm_rmp_admin_documents_post(this.document_details).subscribe(response => {
        this.spinner.show();
        $("#close_modal:button").click();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_admin_documents;
          if (this.editid) {
            this.toastr.success("Document updated");
          }
          else this.toastr.success("New document added");
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.editid = undefined;
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
          this.toastr.error("Server problem encountered")
        })
      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered")
      });
      this.naming.push(this.document_details);
    }
    else if (link_title != "" && upload_doc != null && link_url == "") {
      this.files()
    }
    else if (link_title != "" && upload_doc != null && link_url != "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select one, either Url or Upload</h5>";
      document.getElementById("errorTrigger").click()
    }
  }

  // delete document from server
  public deleteDocument(id: number, index: number) {
    this.spinner.show()
    this.django.ddm_rmp_admin_documents_delete(id).subscribe(response => {
      this.naming = this.naming.filter(item => item['ddm_rmp_desc_text_admin_documents_id'] != id)
      let subscription = this.dataProvider.currentlookUpTableData.subscribe(element => {
        element['data'].desc_text_admin_documents = element['data'].desc_text_admin_documents.filter(item => item.ddm_rmp_desc_text_admin_documents_id != id)
        console.log(element)
        setTimeout(()=>{subscription.unsubscribe()
          this.dataProvider.changelookUpData(element)},100)
          this.spinner.hide()
      })
      this.editid = undefined;
      if (this.deleteIndex == undefined) {
        this.toastr.success("Document deleted successfully");
      }
      this.deleteIndex = undefined
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered")
    })
  }

  // delete file from server
  public delete_upload_file(id, index) {
    this.spinner.show();
    this.django.delete_upload_doc(id).subscribe(res => {
      this.django.get_files().subscribe(ele => {
        this.filesList = ele['list'];
        if (this.filesList) {
          this.dataProvider.changeFiles(ele)
        }
      })
      this.toastr.success("Document deleted");
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered")
    })
  }

  public url() {
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

  // selecting of file
  public renameFile(files: FileList) {
    var reader = new FileReader();
    reader.readAsText(files.item(0), 'UTF-8');
    let self = this;
    reader.onload = function (event) {
      self.createNewFile(event.target['result'], files.item(0));
    }
  }

  // remaing of selected file with document title 
  public createNewFile(value, file) {
    let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let exe = file.name.substr(file.name.lastIndexOf('.') + 1);
    if (document_title === '') {
      document.getElementById("errorModalMessage").innerHTML = "<h5>please enter document name</h5>";
      document.getElementById("errorTrigger").click()
    } else {
      this.file = new File([(<HTMLInputElement>document.getElementById("attach-file1")).files[0]], document_title + "." + exe, { type: file.type, lastModified: file.lastModified });
    }
  }

  // upload file to server
  public files() {
    if (this.file['type'] == 'text/csv' || this.file['type'] == 'application/pdf' || this.file['type'] == 'application/msword' || this.file['type'] == 'application/vnd.ms-word.document.macroEnabled.12' || this.file['type'] == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || this.file['type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || this.file['type'] == 'application/vnd.ms-excel') {
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
      var formData = new FormData();
      formData.append('file_upload', this.file);
      formData.append('uploaded_file_name', document_title);
      formData.append('flag', "is_admin");
      formData.append('type', 'rmp');

      this.spinner.show();
      this.django.ddm_rmp_file_data(formData).subscribe(response => {
        this.django.get_files().subscribe(ele => {
          this.filesList = ele['list'];
          if (this.filesList) {
            this.dataProvider.changeFiles(ele)
          }
        })
        $("#document-url").attr('disabled', 'disabled');
        this.spinner.hide();
        $('#uploadCheckbox').prop('checked', false);
        $("#attach-file1").val('');
        this.toastr.success("Uploaded Successfully");
        document.getElementById("close_modal").click()
        if (this.editid) {
          this.deleteDocument(this.editid, this.deleteIndex)
        }
      }, err => {
        this.spinner.hide();
        $("#document-url").removeAttr('disabled');
        $("#attach-file1").val('');
        if (err && err['status'] === 400)
          this.toastr.error("Submitted file is empty");
        else
          this.toastr.error("Server Error");
        $('#uploadCheckbox').prop('checked', false);
      });
    }
    else {
      this.toastr.error(this.django.defaultUploadMessage)
    }
  }


  // setting a few properties of component
  public editDoc(id, val, url, index) {
    this.editid = id;
    this.deleteIndex = index
    this.changeDoc = true;
    (<HTMLInputElement>document.getElementById('document-name')).value = val;
    (<HTMLInputElement>document.getElementById('document-url')).value = url;
    (<HTMLInputElement>document.getElementById('uploadCheckbox')).checked = false;
  }

  // edit doc and save it
  public editDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "" || link_url == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
    } else {
      $("#close_modal:button").click()
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();

      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      this.document_detailsEdit["ddm_rmp_desc_text_admin_documents_id"] = this.editid;
      this.document_detailsEdit["title"] = document_title;
      this.document_detailsEdit["url"] = document_url;

      this.django.ddm_rmp_admin_documents_put(this.document_detailsEdit).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_admin_documents;
          this.toastr.success("Document updated");
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.changeDoc = false;
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
          this.toastr.error("Server problem encountered")
        })
      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered")
      });
    }
  }

  // route to internal and external links
  routeToUrl(url){
    let urlList = this.auth_service.getListUrl();
    let appUrl = urlList.find(link => link === url)
    if (appUrl) {
      if (this.validateRestictedUrl(url) && this.user_role == "Business-user") {     //restricting business users to access unauthorised tab
        this.toastr.error("Access Denied !")
        return
      }
      this.router.navigateByUrl(url)
    }
    else window.open(url)

  }

  // validate weather the url is ristricted or not
  validateRestictedUrl(url){
    let restricedUrl =  this.auth_service.restrictedUrls()
    let urlFinder = restricedUrl.filter(item => item == url)
    if(urlFinder.length > 0) return true
    else return false
  }
}
