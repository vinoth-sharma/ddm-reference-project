import { Component, OnInit } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-reference-doc',
  templateUrl: './reference-doc.component.html',
  styleUrls: ['./reference-doc.component.css']
})
export class ReferenceDocComponent implements OnInit {
  content;
  naming: Array<object>;
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

  public delete_document_details;

  constructor(private django: DjangoService, private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService, private dataProvider: DataProviderService) {
    // this.naming = "Distribution DataMart (DDM) is a repository of end-to-end order date from various GM source systems that is \n    managed by the Order Fulfillment DDM Team to create ad hoc reports for a variety of GM entities and vendors. \n    User can define report criteria in this portal and the DDM Team will generate report(s) based on those requirements. \n    DDM is updated nightly and has a two-day lag as outlined below:\n    \n    Monday       through previous Friday\n    Tuesday      through previous Saturday\n    Wednesday    through previous Monday \n    Thursday     through previous Tuesday \n    Friday       through previous Wednesday \n    \n    DDM recieves data from the following source systems: \n    - Vehicle Order Database (VOD) \n    - Vehicle Information Database (VID) \n    - Dealer Information Database (GM DID) \n    - Vehicle Order Management Specifications (VOM specs) \n    - Sales planning & Allocation (SPA) \n    - Vehicle Transportation Information Management System (VTIMS) \n    \n    DDM contains 3 current model years plus the ramp up of one new model year. It also includes US orders meant \n    for US consumption. GM of Canada and Export (formerly NAIPC). Vehicle owner information is not available. \n   \n    The DDM database includes all orders placed in GM's ordering system through to the time the vehicle is sold.\n    Order number through VIN data showing initial order entry (retail,fleet,other) and option content is available. The \n    order, and all events as it moves through each stage (ordered, placed, produced, transported, inventory) and is \n    ultimately sold by the dealer. DDM also provides metrics and summary reports that can be requested. User can \n    define order type distribution entity."
    this.editMode = false;
    this.content = dataProvider.getLookupTableData()
  }

  ngOnInit() {
    // console.log(JSON.stringify({name:`  Distribution DataMart (DDM) is a repository of end-to-end order date from various GM source systems that is 
    // managed by the Order Fulfillment DDM Team to create ad hoc reports for a variety of GM entities and vendors. 
    // User can define report criteria in this portal and the DDM Team will generate report(s) based on those requirements. 
    // DDM is updated nightly and has a two-day lag as outlined below:

    // Monday       through previous Friday
    // Tuesday      through previous Saturday
    // Wednesday    through previous Monday 
    // Thursday     through previous Tuesday 
    // Friday       through previous Wednesday 

    // DDM recieves data from the following source systems: 
    // - Vehicle Order Database (VOD) 
    // - Vehicle Information Database (VID) 
    // - Dealer Information Database (GM DID) 
    // - Vehicle Order Management Specifications (VOM specs) 
    // - Sales planning & Allocation (SPA) 
    // - Vehicle Transportation Information Management System (VTIMS) 

    // DDM contains 3 current model years plus the ramp up of one new model year. It also includes US orders meant 
    // for US consumption. GM of Canada and Export (formerly NAIPC). Vehicle owner information is not available. 

    // The DDM database includes all orders placed in GM's ordering system through to the time the vehicle is sold.
    // Order number through VIN data showing initial order entry (retail,fleet,other) and option content is available. The 
    // order, and all events as it moves through each stage (ordered, placed, produced, transported, inventory) and is 
    // ultimately sold by the dealer. DDM also provides metrics and summary reports that can be requested. User can 
    // define order type distribution entity.`}))
    this.spinner.show()

    // console.log(this.content)
    let temp = this.content['data'].desc_text_reference_documents;
    // console.log(temp);
    this.spinner.hide()
    this.naming = temp;
    // console.log(this.naming);
    // <HTMLTextAreaElement>document.getElementById("editable").innerHTML = this.naming;


    // let list = document.getElementById("editable").firstElementChild.innerHTML;
    // console.log(list);
  }

  content_edit() {
    console.log("success");
    this.editMode = false;
  }
  editTrue() {
    this.editMode = !this.editMode;
  }
  addDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "" || link_url == "") {
      alert("Fields cannot be left blank")
    } else {
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
      console.log(document_title);
      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      console.log(document_url);
      this.document_details["title"] = document_title;
      this.document_details["url"] = document_url;
      console.log(this.document_details)
      this.django.ddm_rmp_reference_documents_post(this.document_details).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_reference_documents;
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
    // this.naming.push(this.document_details);
  }

  deleteDocument(id: number, index: number) {
    console.log(id)
    this.spinner.show()
    this.django.ddm_rmp_reference_documents_delete(id).subscribe(response => {
      console.log(response)
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
    console.log("ID is :: " + id);
  }
  NewDoc() {
    (<HTMLInputElement>document.getElementById('document-name')).value = "";
    (<HTMLInputElement>document.getElementById('document-url')).value = "";
  }

  editDocument() {
    let link_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();
    let link_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
    if (link_title == "" || link_url == "") {
      alert("Fields cannot be left blank")
    } else {
      this.spinner.show()
      let document_title = (<HTMLInputElement>document.getElementById('document-name')).value.toString();

      let document_url = (<HTMLInputElement>document.getElementById('document-url')).value.toString();
      this.document_detailsEdit["ddm_rmp_desc_text_reference_documents_id"] = this.editid;
      this.document_detailsEdit["title"] = document_title;
      this.document_detailsEdit["url"] = document_url;
      console.log(this.document_detailsEdit)

      this.django.ddm_rmp_reference_documents_put(this.document_detailsEdit).subscribe(response => {
        this.spinner.show();
        this.django.getLookupValues().subscribe(response => {
          this.naming = response['data'].desc_text_reference_documents;
          (<HTMLInputElement>document.getElementById('document-name')).value = "";
          (<HTMLInputElement>document.getElementById('document-url')).value = "";
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