import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http'
import { environment } from "../../../environments/environment";
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-save-sheet-dialog',
  templateUrl: './save-sheet-dialog.component.html',
  styleUrls: ['./save-sheet-dialog.component.css']
})
export class SaveSheetDialogComponent implements OnInit {


  constructor(private dialogRef: MatDialogRef<SaveSheetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public http: HttpClient) { }

  reportList: Array<any> = [];
  selectedSheets = [];
  sheetName: string = '';
  reportName: string = '';
  dataLoaded: boolean = false;

  ngOnInit() {
    // console.log(this.data);
    let url = `${environment.baseUrl}reports/get_report_list/?user_id=${this.data.user_id}&sl_id=${this.data.sl_id}`;

    this.http.get(url)
      .pipe(catchError(this.handleError))
      .subscribe((res: any) => {
        this.reportList = res.data.report_list;

        this.reportList.forEach(element =>{
          if(element.report_id === +this.data.report_id){
            this.selectedSheets = element.sheet_names
            this.reportName = element.report_name
          }
        });
        // console.log(this.selectedSheets);
        this.dataLoaded = true;
      });
  }

  saveSheet() {
    this.dialogRef.close({
      sheet_name : this.sheetName,
      report_name : this.reportName
    });
  }

  checkSheetNameExist(){
    
    if(this.sheetName.trim())
      return this.selectedSheets.some((ele) => ele === this.sheetName)
    else
      return false
  }

  isEmpty(){
    return this.sheetName?false:true;
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }

  public handleError(error: any): any {
    let errObj: any = {
      status: error.status,
      message: error.error || {}
    };

    throw errObj;
  }
}
