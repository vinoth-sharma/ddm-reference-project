import { Component, OnInit, Input } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as Rx from "rxjs";
import * as $ from "jquery";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "src/app/authentication.service";

@Component({
  selector: 'app-ddm-intro',
  templateUrl: './ddm-intro.component.html',
  styleUrls: ['./ddm-intro.component.css']
})
export class DdmIntroComponent implements OnInit {
  naming: string = "Loading";
  editMode: Boolean;
  enable_edits = false
  editModes = false;
  original_content;
  original_contents;
  enableUpdateData = false;
  description_text = {
    "ddm_rmp_desc_text_id": 1,
    "module_name": "What is DDM",
    "description": ""
  }

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_texts = {
    "ddm_rmp_desc_text_id": 5,
    "module_name": "Help_WhatIsDDM",
    "description": ""
  }
  namings: string = "Loading";
  content;
  restorepage: any;
  printcontent: any;
  readOnlyContent = true;
  readOnlyContentHelper = true;

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

  user_role: string;
  constructor(private django: DjangoService,private toastr: ToastrService, private auth_service : AuthenticationService ,private dataProvider: DataProviderService, private spinner: NgxSpinnerService) {
    dataProvider.currentlookUpTableData.subscribe(element => {
      this.content = element
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
    let ref = this.content['data']['desc_text']
    let temp = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 1;
    })
    if (temp) {
      this.original_content = temp.description;
    }
    else { this.original_content = "" }
    this.naming = this.original_content;


    let refs = this.content['data']['desc_text']
    let temps = refs.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 5;
    })
    if (temps) {
      this.original_contents = temps.description;
    }
    else { this.original_contents = "" }
    this.namings = this.original_contents;
  }


  textChanged(event) {
    if(!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  content_edits() {
    if (this.enableUpdateData) {
      this.spinner.show()
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_texts['description'] = this.namings;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

        let temp_desc_text = this.content['data']['desc_text'];
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 5) {
            temp_desc_text[index] = this.description_texts;
          }
        })
        this.content['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.content);
        this.editModes = false;
        this.ngOnInit();
        this.original_contents = this.namings;
        this.toastr.success("Updated successfully")
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
    this.namings = this.original_contents;
  }

  editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  content_edit() {
    this.spinner.show()
    this.editMode = false;
    this.readOnlyContent = true;
    this.description_text['description'] = this.naming;
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      let temp_desc_text = this.content['data']['desc_text'];
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 1) {
          temp_desc_text[index] = this.description_text;
        }
      })
      this.content['data']['desc_text'] = temp_desc_text;
      this.dataProvider.changelookUpTableData(this.content);
      this.editMode = false;
      this.ngOnInit()
      this.original_content = this.naming;
      this.toastr.success("Updated Successfully");
      this.spinner.hide()
    }, err => {
      this.toastr.error("Server Error");
      this.spinner.hide()
    })
  }

  editTrue() {
    if (this.editMode) {
      this.readOnlyContent = true;
    }
    else {
      this.readOnlyContent = false;
    }
    this.editMode = !this.editMode;
    this.naming = this.original_content;
  }


  printDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = this.naming;
    document.body.innerHTML = this.printcontent;
    window.print();
    document.body.innerHTML = this.restorepage;
    location.reload(true);
  }

}