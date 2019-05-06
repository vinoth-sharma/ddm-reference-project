import { Component, OnInit, Input } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { NgxSpinnerService } from "ngx-spinner";
import * as Rx from "rxjs";

@Component({
  selector: 'app-ddm-intro',
  templateUrl: './ddm-intro.component.html',
  styleUrls: ['./ddm-intro.component.css']
})
export class DdmIntroComponent implements OnInit {
  public Editor = ClassicEditor;
  content;
  original_content;
  naming: string = "Loading";
  editMode: Boolean;
  description_text = {
    "ddm_rmp_desc_text_id": 1,
    "module_name": "What is DDM",
    "description": ""
  }
  //To print the contents on the page
  restorepage: any;
  printcontent: any;


  contents;
  enable_edits = false
  editModes = false;
  original_contents;
  namings: string = "Loading";

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
    description_texts = {
      "ddm_rmp_desc_text_id": 5,
      "module_name": "Help_WhatIsDDM",
      "description": ""
    }

  constructor(private django: DjangoService, private dataProvider: DataProviderService, private spinner: NgxSpinnerService) {
    this.editMode = false;
    this.content = dataProvider.getLookupTableData()
  }

  notify(){
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
  }

  ngOnInit() {

    let ref = this.content['data']['desc_text']
    let temp = ref.find(function (element) {
      return element.ddm_rmp_desc_text_id == 1;
    })
    this.original_content = temp.description;
    this.naming = this.original_content


    let refs = this.content['data']['desc_text']
    let temps = refs.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 5;
    })
    this.original_contents = temps.description;
    this.namings = this.original_contents;

  }


  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.description_texts['description'] = this.namings;
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_texts).subscribe(response => {
      // console.log("inside the service")
      // console.log(response);
      this.original_contents = this.namings;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    this.editModes = !this.editModes;
    this.namings = this.original_contents;
  }

  public onChanges({ editor }: ChangeEvent) {
    const data = editor.getData();
    // console.log( data );
  }


  content_edit() {
    this.spinner.show()
    this.editMode = false;
    this.description_text["description"] = this.naming
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      // console.log("inside the service")
      // console.log(response)
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

  printDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = this.naming;
    document.body.innerHTML = this.printcontent;
    window.print();
    document.body.innerHTML = this.restorepage;
    location.reload(true);
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    // console.log( data );
  }


}