import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import * as Rx from "rxjs";
import { DataProviderService } from "src/app/rmp/data-provider.service";
// import * as $ from 'jquery';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/authentication.service";
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
declare var $: any;

@Component({
  selector: 'app-main-menu-landing-page',
  templateUrl: './main-menu-landing-page.component.html',
  styleUrls: ['./main-menu-landing-page.component.css']
})
export class MainMenuLandingPageComponent implements OnInit {
  content;
  enable_edit: boolean = false;
  content_loaded: boolean = false;
  textChange: boolean = false;
  original_content;
  naming: string = "Loading";
  enable_edits: boolean = false
  editModes: boolean = false;
  main_menu_content: Array<object>
  newContent: boolean = false
  contentForm: FormGroup;
  active_content_id: number;
  active_content: any;
  displayDelete: Boolean = true;
  data: () => Promise<{}>;
  data2: () => Promise<{}>;
  user_name: string = '';
  user_role: string = '';
  readOnlyContentHelper: boolean = true;
  enableUpdateData: boolean = false;

  config = {
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

  constructor(private django: DjangoService,
    private auth_service: AuthenticationService,
    private dataProvider: DataProviderService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NgToasterComponent) {

    this.contentForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      link_title_url: this.fb.array([])
    })
    this.auth_service.myMethod$.subscribe(currentUser => {
      if (currentUser) {
        this.user_name = currentUser["first_name"] + " " + currentUser["last_name"]
        this.user_role = currentUser["role"]
      }
    })

    this.data = this.dataProvider.loadLookUpTableData
    this.data2 = this.dataProvider.loadLookUpData
  }
  parentSubject: Rx.Subject<any> = new Rx.Subject();
  parentsSubject: Rx.Subject<any> = new Rx.Subject();
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

  ngOnInit() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      Utils.showSpinner();
      if (element) {
        this.dataProvider.changeIntialLoad(true)
        this.dataProvider.currentlookupData.subscribe(element2 => {
          if (element2) {
            this.main_menu_content = element2['main_menu'];
            this.content = element;
            let ref = this.content['data']['desc_text']
            let temp = ref.find(function (element) {
              return element["ddm_rmp_desc_text_id"] == 4;
            })
            if (temp) {
              this.original_content = temp.description;
            }
            else { this.original_content = "" }
            this.naming = this.original_content;
          }
        })
        Utils.hideSpinner();
      }
    })

  }

  content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner();
      this.editModes = false;
      this.readOnlyContentHelper = true;
      this.description_text['description'] = this.naming;
      $('#edit_button').show()
      this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
        let temp_desc_text = this.content['data']['desc_text']
        temp_desc_text.map((element, index) => {
          if (element['ddm_rmp_desc_text_id'] == 4) {
            temp_desc_text[index] = this.description_text;
          }
        })
        this.content['data']['desc_text'] = temp_desc_text;
        this.dataProvider.changelookUpTableData(this.content);
        this.editModes = false;
        this.ngOnInit();
        this.original_content = this.naming;
        this.toastr.success("Updated Successfully");
        Utils.hideSpinner();
        $('#helpModal').modal('hide');
      }, err => {
        Utils.hideSpinner();
        this.toastr.error("Data not Updated");
      })
    } else {
      this.toastr.error("Please enter the data");
    }
  }

  textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.naming = this.original_content;
  }

  editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.naming = this.original_content;
  }

  content_edit(element_id) {
    this.newContent = false;
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
      }
    });
  }

  content_delete(element_id) {
    this.active_content_id = element_id
  }

  delete_confirmation() {
    Utils.showSpinner();
    this.django.ddm_rmp_main_menu_description_text_delete(this.active_content_id).subscribe(response => {
      this.main_menu_content = this.main_menu_content.filter(element => {
        return element["ddm_rmp_main_menu_description_text_id"] != this.active_content_id
      })
      $(function () {
        $("#deleteModal #modal_close_button").click();
      })
      Utils.hideSpinner();
      this.toastr.success("FAQ has been deleted successfully");
    }, err => {
      $(function () {
        $("#deleteModal #modal_close_button").click();
      })
      Utils.hideSpinner();
      this.toastr.error("Server error encountered!");
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
    this.router.navigateByUrl(url)
  }

  saveChanges() {
    if (!this.newContent) {
      Utils.showSpinner();
      let response_json = {
        "ddm_rmp_main_menu_description_text_id": this.active_content_id,
        "question": this.contentForm.value['question'],
        "answer": this.contentForm.value['answer'],
        "link_title_url": this.contentForm.value['link_title_url']
      }
      this.django.ddm_rmp_main_menu_description_text_put(response_json).subscribe(response => {
        this.main_menu_content.map((element, index) => {
          if (this.active_content_id == element["ddm_rmp_main_menu_description_text_id"]) {
            this.main_menu_content[index] = response_json
          }
        })
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        $('#mainMenuModal').modal('hide');
        Utils.hideSpinner();
        this.toastr.success("FAQ has been edited successfully");
      }, err => {
        Utils.hideSpinner();
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        this.toastr.error("Server error encountered!");
      })
    }
    else if (this.newContent) {
      Utils.showSpinner();
      this.django.ddm_rmp_main_menu_description_text_post(this.contentForm.value).subscribe(response => {
        let response_json = this.contentForm.value
        response_json["ddm_rmp_main_menu_description_text_id"] = response["data"]
        this.main_menu_content.push(response_json)
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        Utils.hideSpinner();
        this.toastr.success("New FAQ has been successfully created");
        $('#mainMenuModal').modal('hide');
      }, err => {
        $(function () {
          $("#mainMenuModal #modal_close_button").click();
        })
        Utils.hideSpinner();
        this.toastr.error("Server error encountered!");
      })
    }
  }

}

