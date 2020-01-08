import { Component, OnInit, Input } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service"; 

@Component({
  selector: 'app-ddm-admin',
  templateUrl: './ddm-admin.component.html',
  styleUrls: ['./ddm-admin.component.css']
})
export class DdmAdminComponent implements OnInit {
 
  content;
  naming: Array<object>;
  editMode: Boolean;
  enableUpdateData = false;
  document_details = {
    "title": "",
    "url": "",
    "admin_flag": false
  }
  document_detailsEdit = {
    "ddm_rmp_desc_text_admin_documents_id": "",
    "title": "",
    "url": "",
    "admin_flag": false
  }

  file = null;
  editid;
  changeDoc = false;
  public delete_document_details;
  user_role: string;
  contents;
  enable_edits = false
  editModes = false;
  original_content;
  namings: string = "Loading";
  filesList;

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_text = {
    "ddm_rmp_desc_text_id": 9,
    "module_name": "Help_DDMAdmin",
    "description": ""
  }

  isAdmin = {
    'docs': []
  };

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

  readOnlyContentHelper = true;

  constructor(private django: DjangoService, private auth_service: AuthenticationService, private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService, private dataProvider: DataProviderService) {
    this.editMode = false;
    dataProvider.currentFiles.subscribe(ele => {
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
    dataProvider.currentlookUpTableData.subscribe(element => {
      this.content = element;
    })
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
      }
    })

  }

  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngOnInit() {

    this.spinner.show()

    let temp = this.content['data'].desc_text_admin_documents;
    this.spinner.hide()
    this.naming = temp;

    let ref = this.content['data']['desc_text']
    let temps = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 9;
    })
    // //console.log(temp);
    if (temps) {
      this.original_content = temps.description;
    }
    else { this.original_content = "" }
    this.namings = this.original_content;


  }

  getLink(index) {

    this.spinner.show();
    this.django.get_doc_link(index).subscribe(ele => {
      var url = ele['data']['url']
      window.open(url, '_blank');
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.toastr.error("Server Error");
    })
  }

  

  textChanged(event) {
    if(!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  content_edits() {
    if (this.enableUpdateData) {
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

  edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_content;
  }

  editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_content;
  }

  content_edit() {
    this.editMode = false;
  }

  editTrue() {
    this.editMode = !this.editMode;
  }
  NewDoc() {
    (<HTMLInputElement>document.getElementById('document-name')).value = "";
    (<HTMLInputElement>document.getElementById('document-url')).value = "";
  }

  upload(isChecked) {
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

  addDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    if (link_title == "") {
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
      this.document_details["title"] = document_title;
      this.document_details["url"] = document_url;
      this.django.ddm_rmp_admin_documents_post(this.document_details).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_admin_documents;
          this.toastr.success("Document added", "Success:");
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
          this.toastr.error("Server problem encountered", "Error:")
        })

      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered", "Error:")
      });
      this.naming.push(this.document_details);
    }
    else if (link_title != "" && upload_doc != null && link_url == "") {
      $("#close_modal:button").click()
      this.files()
    }
    else if (link_title != "" && upload_doc != null && link_url != "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select one, either Url or Upload</h5>";
      document.getElementById("errorTrigger").click()
    }

  }

  deleteDocument(id: number, index: number) {
    this.spinner.show()
    this.django.ddm_rmp_admin_documents_delete(id).subscribe(response => {
      document.getElementById("editable" + index).style.display = "none"
      this.toastr.success("Document deleted", "Success:");
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered", "Error:")
    })
  }

  delete_upload_file(id, index) {
    this.spinner.show();
    this.django.delete_upload_doc(id).subscribe(res => {
      document.getElementById("upload_doc" + index).style.display = "none"
      this.toastr.success("Document deleted", "Success:");
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered", "Error:")
    })
  }

  url() {
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


  files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
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
    }, err => {
      this.spinner.hide();
      $("#document-url").removeAttr('disabled');
      $("#attach-file1").val('');
      this.toastr.error("Server Error");
      $('#uploadCheckbox').prop('checked', false);
      // alert(er
    });
  }

  editDoc(id, val, url) {
    this.editid = id;
    this.changeDoc = true;
    (<HTMLInputElement>document.getElementById('document-name')).value = val;
    (<HTMLInputElement>document.getElementById('document-url')).value = url;
  }

  editDocument() {
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
          this.toastr.success("Document updated", "Success:");
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.changeDoc = false;
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
          this.toastr.error("Server problem encountered", "Error:")
        })

      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered", "Error:")
      });
    }
  }
}
