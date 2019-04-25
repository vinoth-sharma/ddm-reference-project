import { Component, OnInit,AfterViewChecked } from '@angular/core';
//import $ from 'jquery';
declare var $: any;
import { Router } from "@angular/router";
import { DjangoService } from 'src/app/rmp/django.service';
import { DatePipe } from '@angular/common'
import { NgxSpinnerService } from "ngx-spinner";
import { DataProviderService } from "src/app/rmp/data-provider.service";
import * as jspdf from 'jspdf';  
import html2canvas from 'html2canvas';  
import * as ClassicEditor from 'node_modules/@ckeditor/ckeditor5-build-classic';
import { ChangeEvent, CKEditorComponent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { ToastrService } from "ngx-toastr";


@Component({
  selector: 'app-submit-landing-page',
  templateUrl: './submit-landing-page.component.html',
  styleUrls: ['./submit-landing-page.component.css']
})
export class SubmitLandingPageComponent implements OnInit {
  
  public Editor = ClassicEditor;
  naming: string = "Loading";
  message : string;
  check : boolean;
  loading = false
  editMode: Boolean;
  description_text = {
    "ddm_rmp_desc_text_id" : 8,
    "module_name": "Submit Request",
    "description":""
  }
  
  date : any
  finalData = {
    'ddm_rmp_user_info_id':1,
    'disclaimer_ack': ""
  };
  saved_timestamp: any;
  disclaimer_timestamp: any;
  saved_date: string;
  disclaimer_message: string;
  disclaimer_date: string;
  saved;
  original_content;
  pdfGenerationProgress: number;
  
  constructor(private router: Router, private django : DjangoService,
    private DatePipe: DatePipe, private spinner : NgxSpinnerService, private dataProvider : DataProviderService,
    private toastr : ToastrService) {
    this.editMode = false;
    this.saved = dataProvider.getLookupTableData();
   }

  ngOnInit() {
    this.spinner.show()
    // this.Data.currentMessage.subscribe(message => this.message = message);
    // this.Data.currentCheck.subscribe(check => this.check = check);
    this.django.getLookupValues().subscribe(data =>{
      this.saved = data
    })
     var user_list = this.saved.data.users_list;
     var sav = user_list.filter(element => element.ddm_rmp_user_info_id == 1)
    //  console.log(sav);
     this.saved_timestamp = sav[0].saved_setting;
     this.disclaimer_timestamp = sav[0].disclaimer_ack;
     this.saved_date = this.DatePipe.transform(this.saved_timestamp, 'yyyy-MM-dd')
      //console.log(this.saved_date)
     // let saved_date=new Date(this.saved_timestamp);
      this.disclaimer_date=this.DatePipe.transform(this.disclaimer_timestamp, 'yyyy-MM-dd')
      // console.log("Date is")
      // console.log(this.disclaimer_timestamp);
     // console.log(saved_date)
        // let TodayDate = this.DatePipe.transform(new Date(), 'yyyy-MM-dd')
      //console.log(TodayDate)
      //**********************Check for Saved Settings******************* */
        if(!this.saved_date){
          // console.log("Saved Date")
          // console.log(this.saved_date)
        this.message = "No Saved Settings";
        $(".saved-checkbox").prop("checked", false); 
        $(".saved-checkbox").prop("disabled", true);      
        //this.Data.changeCheck(true);
        }
        else {
          // console.log("Saved Date")
          // console.log(this.saved_date)
          this.message = "Settings Saved" + " " + this.saved_date;
          //console.log(this.saved_date)
          $(".saved-checkbox").prop("checked", true);
          $(".saved-checkbox").prop("disabled", true);
        }
        //**********************Check for Disclaimer Acknowledged******************* */
        if(!this.disclaimer_date){
          // console.log("Disclaimer Date")
          // console.log(this.disclaimer_date)
          //$('#disclaimer-id').prop('disabled', false);//Enable the Acknowledge button
          this.disclaimer_message = "Acknowledgement Required";
          $(".disclaimer-checkbox").prop("checked", false); 
          $(".disclaimer-checkbox").prop("disabled", true);      
          //this.Data.changeCheck(true);
          }
        else {
          // console.log("Disclaimer Date")
          // console.log(this.disclaimer_date)
           $(".disclaimer-checkbox").prop("checked", true);
          $(".disclaimer-checkbox").prop("disabled", true);
          $('#disclaimer-id').prop('disabled', true);
          this.disclaimer_message = "Disclaimers Acknowledged";
          document.getElementById('disclaimer-id').style.backgroundColor="gray";
         
        }
    console.log("Disclaimer message")
    console.log(this.disclaimer_message)

      
      let ref = this.saved['data']['desc_text']
      let temp = ref.find(function(element){
        return element.ddm_rmp_desc_text_id == 8;
      })
      // console.log(temp);
      this.original_content= temp.description;
      this.naming = this.original_content;
      // console.log(this.naming);
      

   
    // if(this.check == false){
    //   $(".saved-checkbox").prop("disabled", true)
    //   $(".saved-checkbox").prop("checked", false);
      
    // }
    // else{
    //   $(".saved-checkbox").prop("disabled", true);
    //   $(".saved-checkbox").prop("checked", true);
    // }
    // console.log($(".saved-checkbox").attr("color"))
    // $('input.disclaimer-checkbox').prop("disabled", true);
    this.spinner.hide()
    // if(!this.disclaimer_date) 
    // {
    // console.log(this.disclaimer_date)
    // $('#disclaimer-id').prop('disabled', false);
    // }
    // else {
    // $('#disclaimer-id').prop('disabled', true);
    // document.getElementById('disclaimer-id').style.backgroundColor="gray";
    // }
  }
  
  navigate() {
    this.router.navigate(["user/main/user-profile"]);
  }

  content_edit(){
    this.spinner.show()
    this.editMode = false;
    this.description_text['description'] = this.naming;
    this.django.ddm_rmp_landing_page_desc_text_post(this.description_text).subscribe(response =>{
      this.original_content = this.naming;
      // console.log("inside the service")
      // console.log(response)
      this.spinner.hide()
      this.toastr.success("Data updated","Success:")
    },err=>{
      this.spinner.hide()
      this.toastr.error("Server problem encountered","Error:")
    })
  }

  editTrue(){
    this.editMode = !this.editMode;
    this.naming = this.original_content;
  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    // console.log( data );
  }
  
 

  checkDisclaimer()
  {
    // console.log(this.disclaimer_date)
    if(!this.disclaimer_date){
      this.finalData["disclaimer_ack"] = this.DatePipe.transform(new Date(), 'yyyy-MM-dd hh:mm:ss.SSS');
      this.django.user_info_disclaimer(this.finalData).subscribe(response => {
        document.getElementById('disclaimer-id').style.backgroundColor="gray";
        this.toastr.success("Disclaimers Acknowledged","Success:")
        $(".disclaimer-checkbox").prop("checked", true);
        $(".disclaimer-checkbox").prop("disabled", true);
        this.disclaimer_message = "Disclaimers Acknowledged";
        $('#disclaimer-id').prop('disabled', true);
        // console.log("Wanted Response")
         console.log(this.finalData)
        // console.log(response)
      },err=>{
        this.toastr.error("Server problem encountered","Error:")
      })
    }
      else {
      this.finalData["disclaimer_ack"] = this.DatePipe.transform(this.disclaimer_date, 'yyyy-MM-dd hh:mm:ss.SSS');
     
    }
  }  

  captureScreen()  
  {  
    var data = document.getElementById('disclaimer-modal');  
    html2canvas(data).then(canvas => {  
      var imageWidth = 208;   
      var pageHeight = 295;    
      var imageHeight = canvas.height * imageWidth / canvas.width;  
      var heightLeft = imageHeight;  
    this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST'); 
    heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          pdf.addPage();
          console.log('Adding page');
          pdf.addImage(contentDataURL, 'PNG', 0, heightLeft - imageHeight, imageWidth, imageHeight, undefined, 'FAST');
          this.pdfGenerationProgress = 100 * (1 - heightLeft / imageHeight);
          heightLeft -= pageHeight;
        }
      pdf.save('DDM Disclaimer.pdf'); // Generated PDF   
    });  
  } 

}
