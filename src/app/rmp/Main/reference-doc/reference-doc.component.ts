import { Component, OnInit,AfterViewInit, Input } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";
import * as Rx from "rxjs";
import ClassicEditor from 'src/assets/cdn/ckeditor/ckeditor.js';  //CKEDITOR CHANGE 
// import { ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
// import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { AuthenticationService } from "src/app/authentication.service";

@Component({
  selector: 'app-reference-doc',
  templateUrl: './reference-doc.component.html',
  styleUrls: ['./reference-doc.component.css']
})
export class ReferenceDocComponent implements OnInit,AfterViewInit {
  content;
  get_url;
  naming: Array<object>;
  private editorHelp;
  @Input() editorDataHelp;
  
  public editorConfig = {            //CKEDITOR CHANGE 
    fontFamily : {
      options : [
        'default',
        'Arial, Helvetica, sans-serif',
        'Courier New, Courier, monospace',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif'
      ]
    },
    removePlugins : ['ImageUpload','ImageButton','Link','MediaEmbed','Iframe','Save'],
    fontSize : {
      options : [
        9,11,13,'default',17,19,21,23,24
      ]
    }
    // extraPlugins: [this.MyUploadAdapterPlugin]
  };
  file = null;
  editMode: Boolean;
  changeDoc = false;
  editid;
  document_details = {
    "title": "",
    "url": "",
    "admin_flag": false
  }
  document_detailsEdit = {
    "ddm_rmp_desc_text_reference_documents_id": "",
    "title": "",
    "url": "",
    "admin_flag": false
  }

  filesList;
  contents;
  enable_edits = false
  editModes = false;
  original_content;
  public isChecked;
  namings: string = "Loading";
  // public Editor = ClassicEditor;
  

  public delete_document_details;
  user_role : string;
  isRef = {
    'docs' : []
  }
  constructor(private django: DjangoService,private auth_service:AuthenticationService, 
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService, 
    private dataProvider: DataProviderService) {
    // this.naming = "Distribution DataMart (DDM) is a repository of end-to-end order date from various GM source systems that is \n    managed by the Order Fulfillment DDM Team to create ad hoc reports for a variety of GM entities and vendors. \n    User can define report criteria in this portal and the DDM Team will generate report(s) based on those requirements. \n    DDM is updated nightly and has a two-day lag as outlined below:\n    \n    Monday       through previous Friday\n    Tuesday      through previous Saturday\n    Wednesday    through previous Monday \n    Thursday     through previous Tuesday \n    Friday       through previous Wednesday \n    \n    DDM recieves data from the following source systems: \n    - Vehicle Order Database (VOD) \n    - Vehicle Information Database (VID) \n    - Dealer Information Database (GM DID) \n    - Vehicle Order Management Specifications (VOM specs) \n    - Sales planning & Allocation (SPA) \n    - Vehicle Transportation Information Management System (VTIMS) \n    \n    DDM contains 3 current model years plus the ramp up of one new model year. It also includes US orders meant \n    for US consumption. GM of Canada and Export (formerly NAIPC). Vehicle owner information is not available. \n   \n    The DDM database includes all orders placed in GM's ordering system through to the time the vehicle is sold.\n    Order number through VIN data showing initial order entry (retail,fleet,other) and option content is available. The \n    order, and all events as it moves through each stage (ordered, placed, produced, transported, inventory) and is \n    ultimately sold by the dealer. DDM also provides metrics and summary reports that can be requested. User can \n    define order type distribution entity."
    this.editMode = false;
    
    dataProvider.currentFiles.subscribe(ele =>{
      if(ele){
        this.filesList = ele['list'];
        this.filesList.forEach(ele =>{
          console.log(ele);
          // this.isRef['docs'] = []
          if(ele['flag'] == 'is_ref'){
            this.isRef['docs'].push(ele);
          }
        })
      }
    })
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

  parentsSubject: Rx.Subject<any> = new Rx.Subject();
    description_text = {
      "ddm_rmp_desc_text_id": 8,
      "module_name": "Help_RefDoc",
      "description": ""
    }

    notify(){
      this.enable_edits = !this.enable_edits
      this.parentsSubject.next(this.enable_edits)
      this.editModes = true
      $('#edit_button').hide()
    }

  ngAfterViewInit(){
    ClassicEditor.create(document.querySelector('#ckEditorHelp'), this.editorConfig).then(editor => {
      this.editorHelp = editor;
      //console.log('Data: ', this.editorDataHelp);
      this.editorHelp.setData(this.namings);
      this.editorHelp.isReadOnly = true;
    })
      .catch(error => {
        //console.log('Error: ', error);
      })
  }    

  ngOnInit() {

    this.spinner.show()

    // //console.log(this.content)
    let temp = this.content['data'].desc_text_reference_documents;
    // //console.log(temp);
    this.spinner.hide()
    this.naming = temp;


    let ref = this.content['data']['desc_text']
    let temps = ref.find(function (element) {
      return element["ddm_rmp_desc_text_id"] == 8;
    })
    // //console.log(temp);
    if(temps){
      this.original_content = temps.description;
    }
    else{ this.original_content = ""}
    this.namings = this.original_content;

    
  }

  upload(isChecked){
    if($('#uploadCheckbox').is(':checked')){
      $('#document-url').attr('disabled', 'disabled');
      $('#attach-file1').removeAttr('disabled');
      (<HTMLInputElement>document.getElementById('document-url')).value = "";
    }
    else{
      $('#document-url').removeAttr('disabled');
      $('#attach-file1').attr('disabled', 'disabled');
     $("#attach-file1").val('');
     (<HTMLInputElement>document.getElementById('document-url')).value = "";
    }
  }

  content_edits(){
    this.spinner.show()
    this.editModes = false;
    this.editorHelp.isReadOnly = true;
    this.description_text['description'] = this.editorHelp.getData();
    $('#edit_button').show()
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response => {
      let temp_desc_text = this.content['data']['desc_text']
      temp_desc_text.map((element,index)=>{
        if(element['ddm_rmp_desc_text_id']==8){
          temp_desc_text[index] = this.description_text
        }
      })
      this.content['data']['desc_text'] = temp_desc_text
      this.dataProvider.changelookUpTableData(this.content)  
      //console.log("changed")    
      this.editModes = false;
      this.ngOnInit()
      this.original_content = this.namings;
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
    })
  }

  edit_True() {
    if(this.editModes){
      this.editorHelp.isReadOnly = true; 
    }
    else{
      this.editorHelp.isReadOnly = false;
    }
    this.editModes = !this.editModes;
    this.editorHelp.setData(this.namings)
    this.namings = this.original_content;
    $('#edit_button').show()
  }

  content_edit() {
    //console.log("success");
    this.editMode = false;
  }
  editTrue() {
    this.editMode = !this.editMode;
  }

  getLink(index){

    this.spinner.show();
    this.django.get_doc_link(index).subscribe(ele =>{
      var url = ele['data']['url']
      window.open(url, '_blank');
      this.spinner.hide();
      // this.django.getDoc(url).subscribe(response =>{
      //   console.log(response);
      // })
    },err =>{
      this.spinner.hide();
      this.toastr.error("Server Error");
    })

  }

  url(){
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();

    if(link_url != ""){
      $("#attach-file1").attr('disabled', 'disabled');
      $("#upload-doc").attr('disabled', 'disabled'); 
    }
    else{
      $("#attach-file1").removeAttr('disabled');
      $("#upload-doc").removeAttr('disabled');
    } 
  }

  doc(){
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    // console.log(upload_doc)
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    this.url();
    if(upload_doc != null){
      $("#document-url").attr('disabled', 'disabled');
    }
    if(upload_doc == null){
      $("#document-url").removeAttr('disabled');
    }
  }

  addDocument() {
    let upload_doc = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
      // alert("Fields cannot be left blank")
    } 
    else if(link_title != "" && link_url == "" && upload_doc == undefined){
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
    }
    else if(link_title != "" && link_url != "" && upload_doc == undefined) {
      $("#close_modal:button").click()
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
      //console.log(document_title);
      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      //console.log(document_url);
      this.document_details["title"] = document_title;
      this.document_details["url"] = document_url;
      //console.log(this.document_details)
      this.django.ddm_rmp_reference_documents_post(this.document_details).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_reference_documents;
          console.log(this.naming);
          this.toastr.success("Document added", "Success:");
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
          this.toastr.error("Server problem encountered", "Error:")
        })

      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered", "Error:")
      });
      this.naming.push(this.document_details);
    }
    else if(link_title != "" && upload_doc != undefined && link_url == ""){
      $("#close_modal:button").click()
      this.files()
    }
    else if(link_title != "" && upload_doc != null && link_url != ""){
      document.getElementById("errorModalMessage").innerHTML = "<h5>Select one, either Url or Upload</h5>";
      document.getElementById("errorTrigger").click()
    }
    
  }

  deleteDocument(id: number, index: number) {
    //console.log(id)
    this.spinner.show()
    this.django.ddm_rmp_reference_documents_delete(id).subscribe(response => {
      //console.log(response)
      document.getElementById("editable" + index).style.display = "none"
      this.toastr.success("Document deleted", "Success:");
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered", "Error:")
    })
  }

  delete_upload_file(id,index){
    this.spinner.show();
    this.django.delete_upload_doc(id).subscribe(res =>{
      document.getElementById("upload_doc"+ index).style.display = "none"
      this.toastr.success("Document deleted", "Success:");
      this.spinner.hide()
    },err=>{
      this.spinner.hide()
      this.toastr.error("Server problem encountered", "Error:")
    })
  }


  editDoc(id, val, url) {
    this.editid = id;
    this.changeDoc = true;
    (<HTMLInputElement>document.getElementById('document-name')).value = val;
    (<HTMLInputElement>document.getElementById('document-url')).value = url;
    //console.log("ID is :: " + id);
  }
  NewDoc() {
    (<HTMLInputElement>document.getElementById('document-name')).value = "";
    (<HTMLInputElement>document.getElementById('document-url')).value = "";
  }

  files() {
    this.file = (<HTMLInputElement>document.getElementById("attach-file1")).files[0];
    let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    var formData = new FormData();
    formData.append('file_upload', this.file);
    formData.append('uploaded_file_name', document_title);
    formData.append('flag', "is_ref");
    formData.append('type', 'rmp');
    
    this.spinner.show();
    this.django.ddm_rmp_file_data(formData).subscribe(response => {
      this.django.get_files().subscribe(ele =>{
        this.filesList = ele['list'];
        if(this.filesList){
          this.isRef['docs'] = [];
          this.filesList.forEach(ele =>{
            if(ele['flag'] == 'is_ref'){
              this.isRef['docs'].push(ele);
            }
          })
        }
      })
     
      $("#document-url").attr('disabled', 'disabled');
      this.spinner.hide();
      $('#uploadCheckbox').prop('checked', false);
      $("#attach-file1").val('');
      this.toastr.success("Uploaded Successfully");
    },err=>{
      this.spinner.hide();
      $("#document-url").removeAttr('disabled');
      $("#attach-file1").val('');
      this.toastr.error("Server Error");
      $('#uploadCheckbox').prop('checked', false);
      // alert(err);
    });
  }

  editDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "" || link_url == "") {
      document.getElementById("errorModalMessage").innerHTML = "<h5>Fields cannot be blank</h5>";
      document.getElementById("errorTrigger").click()
      // alert("Fields cannot be left blank")
    } else {
      $("#close_modal:button").click()
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();

      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      this.document_detailsEdit["ddm_rmp_desc_text_reference_documents_id"] = this.editid;
      this.document_detailsEdit["title"] = document_title;
      this.document_detailsEdit["url"] = document_url;
      //console.log(this.document_detailsEdit)

      this.django.ddm_rmp_reference_documents_put(this.document_detailsEdit).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_reference_documents;
          console.log(this.naming);
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
          this.changeDoc = false;
          this.toastr.success("Document updated", "Success:");
          this.spinner.hide()
        }, err => {
          this.spinner.hide()
          this.toastr.error("Server problem encountered", "Error:")
        })

      }, err => {
        this.spinner.hide()
        this.toastr.error("Server problem encountered", "Error:")
      });

    }
  }


}