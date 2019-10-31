import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ListOfValuesService } from '../list-of-values.service';
import { ToastrService } from 'ngx-toastr';
import Utils from "../../../utils";

@Component({
  selector: 'app-show-lov',
  templateUrl: './show-lov.component.html',
  styleUrls: ['./show-lov.component.css']
})
export class ShowLovComponent implements OnInit {

  @Input() createdLov;
  @Input() column;
  @Input() tableId;
  @Input() load: boolean;
  @Output() public sendData = new EventEmitter();
  defaultError = "There seems to be an error. Please try again later.";
  @Output() public delete = new EventEmitter();
  enableDeleteConfirmationDialog: boolean = false;
  disableApplyBtn: boolean = false;
  selectedId = null;

  constructor(private dialog: MatDialog,
    private dialogRef: MatDialogRef<ShowLovComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private toasterService: ToastrService,
    private listOfValuesService: ListOfValuesService) { }

  ngOnInit() {
  }

  sort() {
    this.createdLov.sort(function (a, b) {
      a = a.lov_name.toLowerCase();
      b = b.lov_name.toLowerCase();
      return (a < b) ? -1 : (a > b) ? 1 : 0;
    });
  }

  ngOnChanges() {
    if (this.createdLov) {
      this.sort();
    }
  }


  public deleteLov(id) {
    this.disableApplyBtn = true;
    Utils.showSpinner();
    this.listOfValuesService.delLov(this.selectedId).subscribe(response => {    //fetch updated list again
      this.toasterService.success("LOV deleted successfully")
      this.delete.emit("deleted");
      this.enableDeleteConfirmationDialog = false;
      this.selectedId = null;
      this.disableApplyBtn = false;
      Utils.hideSpinner();
    }, error => {
      this.toasterService.error(this.defaultError);     
      Utils.hideSpinner();           
    });
  }

  showConfirmationDialog(id) {  
    this.enableDeleteConfirmationDialog = true;
    this.selectedId = id;
  }

  // public deleteLov(id) {
  //   Utils.showSpinner();
  //   this.listOfValuesService.delLov(id).subscribe(response => {    //fetch updated list again
  //     this.toasterService.success("LOV deleted successfully")
  //     this.delete.emit("deleted");
  //     Utils.hideSpinner();
  //   }, error => {
  //     this.toasterService.error(this.defaultError);
  //     Utils.hideSpinner();
  //   });
  // };

  onNoClick() {
    this.dialogRef.close();
  }

  editLov(item) {
    this.sendData.emit(item);
  }

}
