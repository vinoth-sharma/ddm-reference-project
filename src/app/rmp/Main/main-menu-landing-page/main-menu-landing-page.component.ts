import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import * as Rx from "rxjs";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/authentication.service";
import Utils from 'src/utils';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { MatDialog } from '@angular/material/dialog';
import { NotesWrapperComponent } from '../../admin-notes/notes-wrapper/notes-wrapper.component';
declare var $: any;
import { DisplayNotesComponent } from '../../admin-notes/display-notes/display-notes.component';

@Component({
  selector: 'app-main-menu-landing-page',
  templateUrl: './main-menu-landing-page.component.html',
  styleUrls: ['./main-menu-landing-page.component.css']
})
export class MainMenuLandingPageComponent implements OnInit, AfterViewInit {
  public content;
  public importantNotes: any = {}
  public enable_edit: boolean = false;
  public content_loaded: boolean = false;
  public textChange: boolean = false;
  public original_content;
  public naming: string = "Loading";
  public enable_edits: boolean = false
  public editModes: boolean = false;
  public main_menu_content: Array<object>
  public newContent: boolean = false
  public contentForm: FormGroup;
  public active_content_id: number;
  public active_content: any;
  public displayDelete: Boolean = true;
  public data: () => Promise<{}>;
  public data2: () => Promise<{}>;
  public user_name: string = '';
  public user_role: string = '';
  public readOnlyContentHelper: boolean = true;
  public enableUpdateData: boolean = false;
  public info
  public admin_notes: any = '';
  public db_end_date: any;
  public db_start_date: any;
  public note_status: boolean;
  public disclaimer_encounter_flag = 0;
  public config = {
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

  constructor(private django: DjangoService,
    private auth_service: AuthenticationService,
    private dataProvider: DataProviderService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: NgToasterComponent,
    private dialog: MatDialog
  ) {

    this.contentForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      link_title_url: this.fb.array([])
    });
    this.auth_service.myMethod$.subscribe(currentUser => {
      if (currentUser) {
        this.user_name = currentUser["first_name"] + " " + currentUser["last_name"]
        this.user_role = currentUser["role"]
      }
    });
    this.data = this.dataProvider.loadLookUpTableData
    this.data2 = this.dataProvider.loadLookUpData
  }
  public parentSubject: Rx.Subject<any> = new Rx.Subject();
  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public restorepage: any;
  public printcontent: any
  public error_url: any = 'none';

  public description_text = {
    "ddm_rmp_desc_text_id": 4,
    "module_name": "Help_MainMenu",
    "description": ""
  }

  public notifyChildren() {
    this.enable_edit = !this.enable_edit
    this.parentSubject.next(this.enable_edit)
  }

  public notify() {
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
    this.getCurrentLookUpTable()
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

  public content_edits() {
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
        $('#helpModal').modal('hide');
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

  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.naming = this.original_content;
  }

  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.naming = this.original_content;
  }

  public content_edit(element_id) {
    this.newContent = false;
    this.active_content_id = element_id;
    let target_object = { question: [], answer: [] };
    this.main_menu_content.map(element => {
      if (element['ddm_rmp_main_menu_description_text_id'] == element_id) {
        if (element['link_title_url'].length) {
          target_object['link_title_url'] = this.fb.array([this.fb.group({ title: ['', Validators.required], link: ['', Validators.required] })]);
          this.contentForm = this.fb.group(target_object);
        } else if (!element['link_title_url'].length) {
          target_object['link_title_url'] = this.fb.array([]);
          this.contentForm = this.fb.group(target_object);
        }
        this.contentForm.patchValue(element);
        element['link_title_url'].forEach((url_content, index) => {
          if (index != 0) {
            this.LinkTitleURL.push(this.fb.group({ title: [url_content['title'], Validators.required], link: [url_content['link'], Validators.required] }));
          }
        });
      }
    });
  }

  public content_delete(element_id) {
    this.active_content_id = element_id
  }

  public delete_confirmation() {
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

  public content_new() {
    this.newContent = true;
    this.contentForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      link_title_url: this.fb.array([])
    })
  }

  public PrintDiv() {
    this.restorepage = document.body.innerHTML;
    this.printcontent = document.getElementById('print-content').innerHTML;
    document.body.innerHTML = this.printcontent;
    window.print()
    document.body.innerHTML = this.restorepage
  }

  get LinkTitleURL() {
    return this.contentForm.get('link_title_url') as FormArray;
  }

  // add new link based on validate previous link
  public addLinkTitleURL() {
    this.LinkTitleURL.push(this.fb.group({
      title: ['', Validators.required],
      link: ['', Validators.required]
    }));
  }

  public deleteLinkTitleURL(index) {
    this.LinkTitleURL.removeAt(index);
  }

  public route_url(url) {
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
  validateRestictedUrl(url) {
    let restricedUrl = this.auth_service.restrictedUrls()
    let urlFinder = restricedUrl.filter(item => item == url)
    if (urlFinder.length > 0) return true
    else return false
  }

  public saveChanges() {
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
        $('#mainMenuModal').modal('hide');
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
        $('#mainMenuModal').modal('hide');
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

  // to open important notes popup
  public openAddNotes() {
    this.dialog.open(NotesWrapperComponent, {
      data: this.info.data.admin_note, disableClose: true
    })
  }

  // to read lookup data from currentlookUpTableData observable
  public getCurrentLookUpTable() {
    this.dataProvider.currentlookUpTableData.subscribe(element => {
      if (element) {
        this.info = element;
      }
    })
  }

  // to get the important notes of admin
  public getAdminNotes() {
    if (this.importantNotes.data.admin_note[0])
      this.updateAdminNotesParams(this.importantNotes.data.admin_note[0]);
  }

  // update admin notes parameter
  public updateAdminNotesParams(adminNotes) {

    this.db_start_date = adminNotes.notes_start_date;
    this.db_end_date = adminNotes.notes_end_date;
    this.admin_notes = adminNotes.notes_content;
    this.note_status = adminNotes.admin_note_status;

    let today = new Date();
    let startDate = new Date(this.db_start_date);
    let endDate = new Date(this.db_end_date);

    if (this.note_status) {
      if (today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime())
        this.dialog.open(DisplayNotesComponent, {
          data: { notes: adminNotes.notes_content }, disableClose: true
        })
    } else
      $('#display-notes-status').prop("checked", true);
  }

}