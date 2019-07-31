import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ReportViewService } from "../report-view.service";

@Component({
  selector: 'app-clone-worksheet',
  templateUrl: './clone-worksheet.component.html',
  styleUrls: ['./clone-worksheet.component.css']
})
export class CloneWorksheetComponent implements OnInit {

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato', 'Pepperoni', 'Sausage', 'Tomato'];
  reportList = []; //full report list
  sheetDetails = []; ///selected report, sheet datas

  renameSheetContainer = []
  enableCloneBtn:boolean = false;

  selected = {
    report_id : null,
    sheet_details : []
  }

  constructor(public dialogRef: MatDialogRef<CloneWorksheetComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public reportService: ReportViewService) { }

  ngOnInit(){
    this.reportList = this.reportService.getReportListData()
    console.log(this.reportList);
    
  }
 
  reportSelected(event){
    this.sheetDetails = []; //initailize empty before pushing
    // console.log(event);
    this.selected.report_id = event.value;
    let data = this.reportList.filter(ele=>ele.report_id === event.value);
    // console.log(data);
    for(let i=0;i<data[0].sheet_ids.length;i++){
      this.sheetDetails.push({
        sheet_name : data[0].sheet_names[i],
        sheet_id: data[0].sheet_ids[i],
        isChecked : false,
        new_name: '',
        nameExist : false
      })
    }
    // console.log(this.sheetDetails);
  }
  
  sheetSelected(event){
    this.serialForAiCloning = 0; 
    console.log(event);
    this.sheetDetails.forEach(ele=>{
      ele.isChecked = event.value.some(val=>val === ele.sheet_id) 
    })
    // console.log(this.sheetDetails);

    this.renameSheetContainer = this.sheetDetails.filter(ele=>ele.isChecked).map(obj=>{
      obj.new_name =  this.generateNewName('clone_' + obj.sheet_name);
      return obj
    });

    this.selected.sheet_details = this.renameSheetContainer.map(sheet=>{
      return { sheet_id: sheet.sheet_id , sheet_name: sheet.new_name }
    })

    this.validateCloneBtn();
  }

  validateCloneBtn(){
    // console.log(this.selected);
    if(this.selected.report_id && this.selected.sheet_details.length>0)
      this.enableCloneBtn = true
    else
    this.enableCloneBtn = false
  }

  validateSheetNames(reportName){
    return  this.reportService.checkSheetNameInReport(reportName)
  }
  
  public serialForAiCloning = 0;

  //generates new sheet name , which is not present in current report
  generateNewName(name){
    let flag = this.validateSheetNames(name);
    if(flag){
      let new_name = name + '_' + (++this.serialForAiCloning);
      return this.generateNewName(new_name)
    }
    else{
      return name
    }
  }

  validateGivenSheetNames(){
    this.renameSheetContainer.forEach(sheet=>{
      if(this.validateSheetNames(sheet.new_name))
      {
        sheet.nameExist = true;
      }
      else  
      sheet.nameExist = false;
    })
    console.log(this.renameSheetContainer);
    return this.renameSheetContainer.every(sheet=>sheet.nameExist === false)
  }

  cloneSheets(){
    if(this.validateGivenSheetNames()){
      this.selected.sheet_details = this.renameSheetContainer.map(sheet=>{
        return { sheet_id: sheet.sheet_id , sheet_name: sheet.new_name }
      })
      // console.log(this.renameSheetContainer);
      // console.log(this.selected);
      this.reportService.cloneSheetsToCurrentReport(this.selected).subscribe(res=>{
        console.log(res);
        this.closeDailog();
      })
    }
  }

  closeDailog():void{
    this.dialogRef.close();
  }

}
