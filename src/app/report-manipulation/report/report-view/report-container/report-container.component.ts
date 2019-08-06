import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap ,Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReportViewService } from '../report-view.service';
import { GlobalReportServices } from "../global.reports.service";
import { MatDialog , MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog'
import { RenameSheetComponent } from "../rename-sheet/rename-sheet.component";
import { ConfirmationDialogComponent } from "../custom-components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-report-container',
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.scss']
})
export class ReportContainerComponent implements OnInit {

  sheets = [];
  selected = new FormControl(0);
  public reportId;

  constructor(private router: Router,
              private route: ActivatedRoute, 
              private reportService: ReportViewService , 
              private globalService: GlobalReportServices,
              public dialog :MatDialog) { }

  public showSheetRenameOpt: boolean = false;  //show options on right click on sheets(has rename and delete option)
  public selectedSheetName:string = '';

  ngOnInit() {
    //get selected report id
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.reportId = +params.get('reportId');
      this.globalService.setReportId(this.reportId);
      // this.reportService.setReportId(this.reportId);
      console.log(params);
    });
    
    //get semantic id
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        console.log(element.data["semantic_id"]);
        element.data["semantic_id"]?this.globalService.setSLId(element.data["semantic_id"]):'';
      }
    });

    //get report data
    this.globalService.getReportListHttp().subscribe(res=>{
      console.log(res);
      this.reportService.getReportSheetData(this.reportId);
    });
    
    // whenever changes done on sheetdetails will be subscribed and sheet data will be updated
    this.reportService.sheetDetailsUpdated.subscribe((ele: Array<any>) => {
      console.log(ele);
      this.sheets = ele;
      // this.selected.setValue(this.sheets.length - 1);
    })


  }

  tabClicked(event) {
    // console.log('right click done');
    // console.log(event);

    this.showSheetRenameOpt = true;
    setTimeout(() => {
      let ele = document.getElementById('sheetClickedOpts')
      this.selectedSheetName = event.srcElement.innerText;
      ele.style.left = event.x + 'px';
      let topVal = event.y + 'px';
      let eleHeight = ele.clientHeight + 'px';
      ele.style.top = `calc(${topVal} - ${eleHeight})`;
    }, 0);

    return false
  }

  @HostListener('document:click')
  clicked(){
    if(this.showSheetRenameOpt)
      this.showSheetRenameOpt = false;    
  }

  // addTab() {
  //   this.sheets.push({ name: 'Sheet ' + (this.sheets.length + 1), type: '' });
  //   this.selected.setValue(this.sheets.length - 1);
  // }

  
  deleteSheet(index: number) {
    this.reportService.deleteSheetsFromReport(index,this.selectedSheetName).subscribe(res=>{
      console.log(res);
    })
  }
  
  openDeleteSheetDailog(i){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      data : { sheetName : this.selectedSheetName, index: i , confirmation:false ,
        modalTitle : 'Delete Sheet',
        modalBody : 'This operation delete sheet from report permanently. Please confirm you are not doing while sleeping. ',
        modalBtn : 'Delete' }
    })
    dialogRef.afterClosed().subscribe(result=>{
      // this.dialogClosed();
      console.log(result);
      if(result)
        result.confirmation? this.deleteSheet(result.index):'';
    })
  }

  openRenameSheetDailog(){
    const dialogRef = this.dialog.open(RenameSheetComponent,{
      data : this.selectedSheetName
    })
    dialogRef.afterClosed().subscribe(result=>{
      // this.dialogClosed();
      console.log(result);
    })
  }
}
