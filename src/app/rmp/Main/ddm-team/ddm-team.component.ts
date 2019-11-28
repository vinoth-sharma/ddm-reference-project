import { Component, OnInit, Input } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-ddm-team',
  templateUrl: './ddm-team.component.html',
  styleUrls: ['./ddm-team.component.css']
})
export class DdmTeamComponent implements OnInit {
  content;
  naming: string = "Loading";
  editMode: Boolean;
  description_text = {
    "ddm_rmp_desc_text_id": 2,
    "module_name": "DDM Team",
    "description": ""
  };
  original_content;

  contents;
  enable_edits = false
  editModes = false;
  original_contents;
  namings: string = "Loading";

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  description_texts = {
    "ddm_rmp_desc_text_id": 7,
    "module_name": "Help_DDMTeam",
    "description": ""
  }
  user_role: string;
  readOnlyContent: boolean = true;
  readOnlyContentHelper: boolean = true;
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

  constructor(private django: DjangoService, private toastr: ToastrService, private auth_service: AuthenticationService, private spinner: NgxSpinnerService, private dataProvider: DataProviderService) {
    this.editMode = false;
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
    let ref = this.content['data']['desc_text'];
    let temp = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 2;
    })
    if (temp) {
      this.original_content = temp.description;
    }
    else { this.original_content = "" }
    this.naming = this.original_content;


    let refs = this.content['data']['desc_text']
    let temps = refs.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 7;
    })
    if (temps) {
      this.original_contents = temps.description;
    }
    else { this.original_contents = "" }
    this.namings = this.original_contents;

  }

  content_edits() {
    this.spinner.show();
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.description_texts['description'] = this.namings;
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {

      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 7) {
          temp_desc_text[index] = this.description_texts
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)
      this.editModes = false;
      this.ngOnInit()
      this.original_contents = this.namings;
      this.toastr.success("Updated successfully")
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem")
    })
  }

  edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  editEnableHelp() {
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
      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 2) {
          temp_desc_text[index] = this.description_text
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)
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
  

}