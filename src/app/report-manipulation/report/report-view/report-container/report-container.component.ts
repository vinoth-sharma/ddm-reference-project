import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReportViewService } from '../report-view.service';

@Component({
  selector: 'app-report-container',
  templateUrl: './report-container.component.html',
  styleUrls: ['./report-container.component.scss']
})
export class ReportContainerComponent implements OnInit {

  tabs = [];
  selected = new FormControl(0);
  public reportId;
  constructor(private route: ActivatedRoute, private reportService: ReportViewService) { }

  public showSheetRenameOpt: boolean = false;  //show options on right click on sheet(has rename and delete option)
  public selectedSheetName:string = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.reportId = +params.get('reportId');
      this.reportService.setReportId(this.reportId);
    });
    this.reportService.sheetDetailsUpdated.subscribe((ele: Array<any>) => {
      console.log(ele);
      this.tabs = ele;
      this.selected.setValue(this.tabs.length - 1);
    })
    this.reportService.getSheetData();


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


  ngViewChecked() {
    console.log('checkdddd');
    
    // Close the dropdown if the user clicks outside of it
    window.onclick = function (event) {
      console.log(event);
      
      if (!event.target.matches('.dropbtn')) {
        console.log('inm');
        
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  }

  addTab() {
    this.tabs.push({ name: 'Sheet ' + (this.tabs.length + 1), type: '' });
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.reportService.deleteExistingSheet(index,this.selectedSheetName);
    // this.tabs.splice(index, 1);
  }
}
