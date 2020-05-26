import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';

@Component({
  selector: 'app-review-req-modal',
  templateUrl: './review-req-modal.component.html',
  styleUrls: ['./review-req-modal.component.css']
})
export class ReviewReqModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReviewReqModalComponent>,
    private toaster: NgToasterComponent,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  reqDate:string = '11-May-2020';
  reqNumber: Number = 3671;
  repTitle: string = 'New Report'

    marketData = [];

  ngOnInit(): void {
console.log(this.data);
    this.generateMarketData(this.data.selectedReqData)
  }

  generateMarketData(data){
    
    if(data.market_data.length){
     let obj = {
       label : "Market(s) selection:",
        data : data.market_data.map(ele=>ele.market)
      }
      this.marketData.push(obj)      
    }
    if(data.division_dropdown.length){
      let obj = {
        label : "Division(s) selection:",
         data : data.division_dropdown.map(ele=>ele.division_desc)
       }
       this.marketData.push(obj)      
     }
    //  if(data.division_dropdown.length){
    //   let obj = {
    //     label : "Division(s) selection:",
    //      data : data.division_dropdown.map(ele=>ele.division_desc)
    //    }
    //    this.marketData.push(obj)      
    //  }

     console.log(this.marketData);

  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}
