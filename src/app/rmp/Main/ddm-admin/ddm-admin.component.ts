import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-ddm-admin',
  templateUrl: './ddm-admin.component.html',
  styleUrls: ['./ddm-admin.component.css']
})
export class DdmAdminComponent implements OnInit {

  naming: Array<object>;
  editMode: Boolean;
  document_details = {
    "title": "",
    "url": "",
    "admin_flag": false
  }
  document_detailsEdit = {
    "ddm_rmp_desc_text_admin_documents_id": "",
    "title": "",
    "url": "",
    "admin_flag": false
  }
  content;
  editid;
  changeDoc = false;
  public delete_document_details;


  constructor(private django: DjangoService, private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService, private dataProvider: DataProviderService) {
    // this.naming = "Distribution DataMart (DDM) is a repository of end-to-end order date from various GM source systems that is \n    managed by the Order Fulfillment DDM Team to create ad hoc reports for a variety of GM entities and vendors. \n    User can define report criteria in this portal and the DDM Team will generate report(s) based on those requirements. \n    DDM is updated nightly and has a two-day lag as outlined below:\n    \n    Monday       through previous Friday\n    Tuesday      through previous Saturday\n    Wednesday    through previous Monday \n    Thursday     through previous Tuesday \n    Friday       through previous Wednesday \n    \n    DDM recieves data from the following source systems: \n    - Vehicle Order Database (VOD) \n    - Vehicle Information Database (VID) \n    - Dealer Information Database (GM DID) \n    - Vehicle Order Management Specifications (VOM specs) \n    - Sales planning & Allocation (SPA) \n    - Vehicle Transportation Information Management System (VTIMS) \n    \n    DDM contains 3 current model years plus the ramp up of one new model year. It also includes US orders meant \n    for US consumption. GM of Canada and Export (formerly NAIPC). Vehicle owner information is not available. \n   \n    The DDM database includes all orders placed in GM's ordering system through to the time the vehicle is sold.\n    Order number through VIN data showing initial order entry (retail,fleet,other) and option content is available. The \n    order, and all events as it moves through each stage (ordered, placed, produced, transported, inventory) and is \n    ultimately sold by the dealer. DDM also provides metrics and summary reports that can be requested. User can \n    define order type distribution entity."
    this.editMode = false;
    this.content = dataProvider.getLookupTableData()

  }

  ngOnInit() {

    this.spinner.show()

    let temp = this.content['data'].desc_text_admin_documents;
    this.spinner.hide()
    this.naming = temp;


  }

  content_edit() {
    this.editMode = false;
  }

  editTrue() {
    this.editMode = !this.editMode;
  }
  NewDoc() {
    (<HTMLInputElement>document.getElementById('document-name')).value = "";
    (<HTMLInputElement>document.getElementById('document-url')).value = "";
  }
  addDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "" || link_url == "") {
      alert("Fields cannot be blank")
    } else {
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
      // console.log(document_title);
      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      // console.log(document_url);
      this.document_details["title"] = document_title;
      this.document_details["url"] = document_url;
      // console.log(this.document_details)
      this.django.ddm_rmp_admin_documents_post(this.document_details).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_admin_documents;
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

    }

  }

  deleteDocument(id: number, index: number) {
    this.spinner.show()
    this.django.ddm_rmp_admin_documents_delete(id).subscribe(response => {
      // console.log(response)
      document.getElementById("editable" + index).style.display = "none"
      this.toastr.success("Document deleted", "Success:");
      this.spinner.hide()
    }, err => {
      this.spinner.hide()
      this.toastr.error("Server problem encountered", "Error:")
    })
  }
  editDoc(id, val, url) {
    this.editid = id;
    this.changeDoc = true;
    (<HTMLInputElement>document.getElementById('document-name')).value = val;
    (<HTMLInputElement>document.getElementById('document-url')).value = url;
    //  console.log("ID is :: "+id);
  }

  editDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "" || link_url == "") {
      alert("Fields cannot be blank")
    } else {
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();

      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      this.document_detailsEdit["ddm_rmp_desc_text_admin_documents_id"] = this.editid;
      this.document_detailsEdit["title"] = document_title;
      this.document_detailsEdit["url"] = document_url;
      // console.log(this.document_detailsEdit)

      this.django.ddm_rmp_admin_documents_put(this.document_detailsEdit).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_admin_documents;
          this.toastr.success("Document updated", "Success:");
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
    }
  }
}