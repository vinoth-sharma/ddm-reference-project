import { Component, OnInit, Input } from '@angular/core';
import { DjangoService } from 'src/app/rmp/django.service';
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-ddm-intro',
  templateUrl: './ddm-intro.component.html',
  styleUrls: ['./ddm-intro.component.css']
})
export class DdmIntroComponent implements OnInit {
  public Editor = ClassicEditor;
  content;
  original_content;
  naming : string = "Loading";
  editMode : Boolean;
  description_text = {
    "ddm_rmp_desc_text_id" : 1,
    "module_name": "What is DDM",
    "description":""
  }
  //To print the contents on the page
  restorepage: any;
  printcontent: any;

  constructor(private django : DjangoService,private dataProvider : DataProviderService, private spinner : NgxSpinnerService) { 
    this.editMode = false;
    this.content = dataProvider.getLookupTableData()
  }
  
  ngOnInit(){

    // console.log(JSON.stringify({name:`  
    // Distribution DataMart (DDM) is a repository of end-to-end order date from various GM source systems that is 
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
    // define order type distribution entity.
    // `}))
      let ref = this.content['data']['desc_text']
      let temp = ref.find(function(element){
        return element.ddm_rmp_desc_text_id == 1;
      })
      // console.log(temp);
      this.original_content = temp.description;
      this.naming = this.original_content

  }
  content_edit(){
    this.spinner.show()
    this.editMode = false;
    this.description_text["description"] = this.naming
    this.django.ddm_rmp_landing_page_desc_text_put(this.description_text).subscribe(response =>{
      // console.log("inside the service")
      // console.log(response)
      this.original_content = this.naming;
      this.spinner.hide()
    },err=>{
      this.spinner.hide()
    })
  }



  editTrue(){
    this.editMode = !this.editMode;
    this.naming = this.original_content;
  }

  printDiv(){
    this.restorepage = document.body.innerHTML;
    this.printcontent = this.naming;
    document.body.innerHTML = this.printcontent;
    window.print();
    document.body.innerHTML = this.restorepage;
    location.reload(true);
  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    // console.log( data );
  }


}