import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as Rx from "rxjs";
import { AuthenticationService } from "src/app/authentication.service";

@Component({
  selector: 'app-ddm-team',
  templateUrl: './ddm-team.component.html',
  styleUrls: ['./ddm-team.component.css']
})
export class DdmTeamComponent implements OnInit {
  public Editor = ClassicEditor;
  naming: string = "Loading";
  editMode: Boolean;
  description_text = {
    "ddm_rmp_desc_text_id": 2,
    "module_name": "DDM Team",
    "description": ""
  }
  content;
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
  user_role:string;
  constructor(private django: DjangoService,private auth_service:AuthenticationService, private spinner: NgxSpinnerService, private dataProvider: DataProviderService) {
    this.editMode = false;
    // this.content = dataProvider.getLookupTableData()
    dataProvider.currentlookUpTableData.subscribe(element=>{
      this.content = element;
    })
    this.auth_service.myMethod$.subscribe(role =>{
      if (role) {
        this.user_role = role["role"]
      }
    })
  }

  notify(){
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  ngOnInit() {
    // console.log(this.content)
    let ref = this.content['data']['desc_text']
    let temp = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 2;
    })
    // console.log(temp);
    this.original_content = temp.description;
    this.naming = this.original_content;


    let refs = this.content['data']['desc_text']
    let temps = refs.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 7;
    })
    this.original_contents = temps.description;
    this.namings = this.original_contents;

  }

  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.description_texts['description'] = this.namings;
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {
      
      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==7){
          temp_desc_text[index] = this.description_texts
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)  
      console.log("changed")    
      this.editModes = false;
      this.ngOnInit()

      this.original_contents = this.namings;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
    $('#edit_button').show()
  }

  public onChanges({ editor }: ChangeEvent) {
    const data = editor.getData();
    // console.log( data );
  }


  content_edit() {
    this.spinner.show()
    this.editMode = false;
    this.description_text['description'] = this.naming;
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==2){
          temp_desc_text[index] = this.description_text
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)  
      console.log("changed")    
      this.editMode = false;
      this.ngOnInit()
      this.original_content = this.naming;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })

  }
  editTrue() {
    this.editMode = !this.editMode;
    this.naming = this.original_content;
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    // console.log( data );
  }

}