import { Component, OnInit} from '@angular/core';
import { ShareReportService } from '../share-report.service'
import Utils from "../../../utils";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-manage-signatures',
  templateUrl: './manage-signatures.component.html',
  styleUrls: ['./manage-signatures.component.css']
})
export class ManageSignaturesComponent implements OnInit {

  defaultError = "There seems to be an error. Please try again later.";
  signatures = [];
  originalData = [];
  isDisabled : boolean = true;

  constructor(
    private toasterService: ToastrService,
    private shareReportService: ShareReportService
  ) { 

  }

  ngOnInit() {
    this.getSignatures();
  }

  public filterList(searchText: string) {
    this.signatures = this.originalData;   
    console.log(this.originalData,"this.originalData");
    
    if (searchText) {
      this.signatures = this.signatures.filter(sign => {
        if ((sign['signature_name'] && (sign['signature_name'].toLowerCase().indexOf(searchText.toLowerCase())) > -1)){
          return sign;
        }
      });
    }
  }

  ngOnChanges() {
    this.originalData = this.signatures.slice();
  }

  // onSelect(event, id) {
  //   if (event.target.checked ) {
  //     this.isDisabled = false;
  //     console.log(id , event.target.checked);
  //     // this.delete.emit(id); 
  //     this.shareReportService.delSignature(id);    
  //   } else {
  //     this.isDisabled = true; 
  //   }
  // }

  // public deleteSignatures(id) {
  //   Utils.showSpinner();
  //   this.shareReportService.delSignature(id).subscribe(response => {
  //     this.toasterService.success(response['message'])
  //     Utils.hideSpinner();
  //     // Utils.closeModals();
  //     this.getSignatures();
  //   }, error => {
  //     this.toasterService.error(error.message['error']);
  //     Utils.hideSpinner();
  //     // Utils.closeModals();
  //   });
  // };

  public getSignatures() {
    this.shareReportService.getSignatures().subscribe(res => {
      this.signatures = res['data'];
      console.log("got signs in manage"),"this.signatures";      
    })
  }

}
