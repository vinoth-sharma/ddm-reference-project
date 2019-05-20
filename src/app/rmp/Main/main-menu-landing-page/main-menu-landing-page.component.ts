import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import * as Rx from "rxjs"
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as $ from 'jquery';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-main-menu-landing-page',
  templateUrl: './main-menu-landing-page.component.html',
  styleUrls: ['./main-menu-landing-page.component.css']
})
export class MainMenuLandingPageComponent {
  content;
  enable_edit = false
  public Editor = ClassicEditor;
  content_loaded = false;
  original_content;
  naming: string = "Loading";
  enable_edits = false
  editModes = false;
  main_menu_content: Array<object>
  newContent: boolean = false
  contentForm: FormGroup;
  active_content_id: number;
  active_content: any;
  displayDelete: Boolean = true;
  data: () => Promise<{}>;
  data2: () => Promise<{}>;
  user_name: string;
  constructor(private django: DjangoService, private spinner: NgxSpinnerService, private dataProvider: DataProviderService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    // this.content = dataProvider.getLookupTableData()
    
    this.contentForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      link_title_url: this.fb.array([])
    })

    this.data = this.dataProvider.loadLookUpTableData
    this.data2 = this.dataProvider.loadLookUpData
  }
  parentSubject: Rx.Subject<any> = new Rx.Subject();
  parentsSubject: Rx.Subject<any> = new Rx.Subject();
  //For printing the page 
  restorepage: any;
  printcontent: any

  description_text = {
    "ddm_rmp_desc_text_id": 4,
    "module_name": "Help_MainMenu",
    "description": ""
  }

  notifyChildren() {
    this.enable_edit = !this.enable_edit
    this.parentSubject.next(this.enable_edit)
  }
  notify() {
    this.enable_edits = !this.enable_edits
    this.parentsSubject.next(this.enable_edits)
    this.editModes = true
    $('#edit_button').hide()
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  ngOnInit() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      this.showSpinner()
      console.log('Inside const', element);
      if (element) {
        this.dataProvider.currentlookupData.subscribe(element2 => {
          if (element2) {
            this.main_menu_content = element2['main_menu'];
            this.content = element;
            let ref = this.content['data']['desc_text']
            let temp = ref.find(function (element) {
              return element["ddm_rmp_desc_text_id"] == 4;
            })
            // console.log(temp);
            this.original_content = temp.description;
            this.naming = this.original_content;
            
          }
        })
        // this.hideSpinner();
        this.django.division_selected().subscribe(res =>{
          let user_info = res['user_text_notification_data']
          this.user_name = user_info.first_name
          this.hideSpinner();
        })
      }
    })

  }

  content_edits() {
    this.spinner.show()
    this.editModes = false;
    this.description_text['description'] = this.naming;
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element, index) => {
        if (element['ddm_rmp_desc_text_id'] == 4) {
          temp_desc_text[index] = this.description_text
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)
      console.log("changed")
      this.editModes = false;
      this.ngOnInit()
      this.original_content = this.naming;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    this.editModes = !this.editModes;
    this.naming = this.original_content;
    $('#edit_button').show()
  }

  content_edit(element_id) {
    this.newContent = false
    this.active_content_id = element_id
    let target_object: any
    this.main_menu_content.map(element => {
      if (element['ddm_rmp_main_menu_description_text_id'] == element_id) {
        target_object = element
        this.contentForm = this.fb.group({
          question: [],
          answer: [],
          link_title_url: this.fb.array([this.fb.group({ title: ['', Validators.required], link: ['', Validators.required] })])
        })
        this.contentForm.patchValue(target_object);
        target_object['link_title_url'].forEach((url_content, index) => {
          if (index != 0) {
            this.LinkTitleURL.push(this.fb.group({ title: [url_content['title'], Validators.required], link: [url_content['link'], Validators.required] }));
          }
        });
        // console.log(this.LinkTitleURL)
      }
    });
  }

  content_delete(element_id) {
    this.active_content_id = element_id
  }

  delete_confirmation() {
    this.spinner.show()
    this.django.ddm_rmp_main_menu_description_text_delete(this.active_content_id).subscribe(response => {
      // console.log(response)
      this.main_menu_content = this.main_menu_content.filter(element => {
        return element["ddm_rmp_main_menu_description_text_id"] != this.active_content_id
      })
      $(function () {
        $("#deleteModal #modal_close_button").click();
      })
      this.spinner.hide()
      this.toastr.success("FAQ has been deleted successfully");
    }, err => {
      $(function () {
        $("#deleteModal #modal_close_button").click();
      })
      this.spinner.hide()
      this.toastr.error("Server error encountered!!", "Error");
    })
  }

  content_new() {
    this.newContent = true;
    this.contentForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      link_title_url: this.fb.array([])
    })
  }

  PrintDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = document.getElementById('print-content').innerHTML;
    document.body.innerHTML = this.printcontent;
    window.print()
    document.body.innerHTML = this.restorepage
  }

  get LinkTitleURL() {
    return this.contentForm.get('link_title_url') as FormArray;
  }

  addLinkTitleURL() {
    this.LinkTitleURL.push(this.fb.group({
      title: ['', Validators.required],
      link: ['', Validators.required]
    }));
  }

  deleteLinkTitleURL(index) {
    this.LinkTitleURL.removeAt(index);
  }

  route_url(url) {
    // console.log(url)
    this.router.navigateByUrl(url)
  }

  saveChanges() {
    if (!this.newContent) {
      this.spinner.show()
      let response_json = {
        "ddm_rmp_main_menu_description_text_id": this.active_content_id,
        "question": this.contentForm.value['question'],
        "answer": this.contentForm.value['answer'],
        "link_title_url": this.contentForm.value['link_title_url']
      }
      // console.log(response_json)
      this.django.ddm_rmp_main_menu_description_text_put(response_json).subscribe(response => {
        // console.log(response)
        this.main_menu_content.map((element, index) => {
          if (this.active_content_id == element["ddm_rmp_main_menu_description_text_id"]) {
            this.main_menu_content[index] = response_json
          }
        })
        // console.log(this.main_menu_content)
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        this.spinner.hide();
        this.toastr.success("FAQ has been edited successfully");
      }, err => {
        this.spinner.hide()
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        this.toastr.error("Server error encountered!!", "Error");
      })
    }
    else if (this.newContent) {
      this.spinner.show()
      this.django.ddm_rmp_main_menu_description_text_post(this.contentForm.value).subscribe(response => {
        let response_json = this.contentForm.value
        response_json["ddm_rmp_main_menu_description_text_id"] = response["data"]
        // console.log(response_json)
        this.main_menu_content.push(response_json)
        // console.log(this.main_menu_content)
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        // console.log(response)
        this.spinner.hide()
        this.toastr.success("New FAQ has been successfully created");
      }, err => {
        // console.log(err)
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        this.spinner.hide()
        this.toastr.error("Server error encountered!!", "Error");
      })
    }
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    // console.log( data );
  }

}

