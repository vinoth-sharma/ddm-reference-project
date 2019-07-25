import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap ,Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReportViewService } from '../report-view.service';
import { GlobalReportServices } from "../global.reports.service";

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
              private globalService: GlobalReportServices) { }

  public showSheetRenameOpt: boolean = false;  //show options on right click on sheets(has rename and delete option)
  public selectedSheetName:string = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.reportId = +params.get('reportId');
      this.globalService.setReportId(this.reportId);
      // this.reportService.setReportId(this.reportId);
      console.log(params);
    });
 
    this.router.config.forEach(element => {
      if (element.path == "semantic") {
        console.log(element.data["semantic_id"]);
        this.globalService.setSLId(element.data["semantic_id"])
      }
    });
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
    console.log('right click done');

    console.log(event);
    this.showSheetRenameOpt = true;
    setTimeout(() => {
      let ele = document.getElementById('sheetClickedOpts')
      console.log(ele);
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

  addTab() {
    this.sheets.push({ name: 'Sheet ' + (this.sheets.length + 1), type: '' });
    this.selected.setValue(this.sheets.length - 1);
  }

  removeTab(index: number) {
    this.reportService.deleteExistingSheet(index,this.selectedSheetName);
    // this.sheets.splice(index, 1);
  }
}
