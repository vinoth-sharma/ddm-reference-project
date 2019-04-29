import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import * as Rx from "rxjs"
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as $ from 'jquery';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-main-menu-landing-page',
  templateUrl: './main-menu-landing-page.component.html',
  styleUrls: ['./main-menu-landing-page.component.css']
})
export class MainMenuLandingPageComponent {
  content;
  enable_edit = false
  main_menu_content: Array<object>
  newContent: boolean = false
  contentForm: FormGroup;
  active_content_id: number;
  active_content: any;
  displayDelete: Boolean = true;
  constructor(private django: DjangoService, private spinner: NgxSpinnerService, private dataProvider: DataProviderService, private fb: FormBuilder, private router: Router, private toastr: ToastrService) {
    // this.content = dataProvider.getLookupTableData()
    let datacontainer = dataProvider.getLookupData()
    this.main_menu_content = datacontainer['main_menu']
  }
  parentSubject: Rx.Subject<any> = new Rx.Subject();

  //For printing the page 
  restorepage: any;
  printcontent: any

  notifyChildren() {
    this.enable_edit = !this.enable_edit
    this.parentSubject.next(this.enable_edit)
  }

  ngOnInit() {
    // this.contentForm = this.fb.group({
    //   question: ['',Validators.required],
    //   answer:['',Validators.required],
    //   link_title_url : this.fb.array([this.fb.group({
    //     title:['',Validators.required],
    //     link:['',Validators.required]
    //   })])
    // })
    this.contentForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      link_title_url: this.fb.array([])
    })

    this.spinner.show()
    // console.log(this.main_menu_content)
    this.spinner.hide()

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
      // console.log(err)
      // document.getElementById("modal_close_button").click()
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
    // document.getElementById("formDeleteButton").click()
    // this.displayDelete = false
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


}

