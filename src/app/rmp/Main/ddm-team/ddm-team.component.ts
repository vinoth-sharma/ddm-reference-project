import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';

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
    "ddm_rmp_desc_text_id": 9,
    "module_name": "DDM Team",
    "description": ""
  }
  content;
  original_content;

  constructor(private django: DjangoService, private spinner: NgxSpinnerService, private dataProvider: DataProviderService) {
    this.editMode = false;
    this.content = dataProvider.getLookupTableData()
  }

  ngOnInit() {
    // console.log(this.content)
    let ref = this.content['data']['desc_text']
    let temp = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 9;
    })
    // console.log(temp);
    this.original_content = temp.description;
    this.naming = this.original_content;



  }

  content_edit() {
    this.spinner.show()
    this.editMode = false;
    this.description_text['description'] = this.naming;
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      // console.log("inside the service")
      // console.log(response);
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