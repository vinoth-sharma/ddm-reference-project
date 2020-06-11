import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import Utils from '../../../../utils';
import * as Rx from "rxjs";
import * as $ from "jquery";
import { AuthenticationService } from "src/app/authentication.service";
import { NgToasterComponent } from '../../../custom-directives/ng-toaster/ng-toaster.component';
@Component({
  selector: 'app-ddm-intro',
  templateUrl: './ddm-intro.component.html',
  styleUrls: ['./ddm-intro.component.css']
})
export class DdmIntroComponent implements OnInit, AfterViewInit {
  public naming: string = "Loading";
  public editMode: Boolean;
  public textChange = false;
  public enable_edits = false
  public editModes = false;
  public original_content;
  public original_contents;
  public enableUpdateData = false;
  public description_text = {
    "ddm_rmp_desc_text_id": 1,
    "module_name": "What is DDM",
    "description": ""
  };
  public parentsSubject: Rx.Subject<any> = new Rx.Subject();
  public description_texts = {
    "ddm_rmp_desc_text_id": 5,
    "module_name": "Help_WhatIsDDM",
    "description": ""
  };
  public namings: string = "Loading";
  public content;
  public restorepage: any;
  public printcontent: any;
  public readOnlyContent = true;
  public readOnlyContentHelper = true;
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
  public isQuillToolBarShown: boolean = true;

  public config = {
    toolbar: null
  };
  public user_role: string;

  constructor(private django: DjangoService, private auth_service: AuthenticationService,
    private dataProvider: DataProviderService,
    public toaster: NgToasterComponent) {
    dataProvider.currentlookUpTableData.subscribe(element => {
      this.content = element
    })
    this.auth_service.myMethod$.subscribe(role => {
      if (role) {
        this.user_role = role["role"]
        if (this.user_role == 'Admin') {
          this.config.toolbar = this.toolbarTooltips;
        }
        else {
          this.config.toolbar = false;
        }
      }
    })
  }

  // initialization of component
  public ngOnInit() {
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

  // initialize after html initialize
  public ngAfterViewInit() {
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

  // detecting text change
  public textChanged(event) {
    this.textChange = true;
    if (!event['text'].replace(/\s/g, '').length) this.enableUpdateData = false;
    else this.enableUpdateData = true;
  }

  // saving content change in help model
  public content_edits() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner()
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
        this.toaster.success("Updated successfully")
        Utils.hideSpinner()
      }, err => {
        Utils.hideSpinner()
        this.toaster.error("error")
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  // resetting help model
  public edit_True() {
    this.editModes = false;
    this.readOnlyContentHelper = true;
    this.namings = this.original_contents;
  }

  // enable edit mode of help model
  public editEnable() {
    this.editModes = true;
    this.readOnlyContentHelper = false;
    this.namings = this.original_contents;
  }

  // saving content of what is ddm? description
  public content_edit() {
    if (!this.textChange || this.enableUpdateData) {
      Utils.showSpinner()
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
        this.toaster.success("Updated Successfully");
        Utils.hideSpinner()
      }, err => {
        this.toaster.error("Server Error");
        Utils.hideSpinner()
      })
    } else {
      this.toaster.error("please enter the data");
    }
  }

  // enable edit mode of What is ddm? description
  public editTrue() {
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