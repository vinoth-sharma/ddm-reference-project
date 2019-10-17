import { Component, OnInit, Inject, Input, EventEmitter,Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ListOfValuesService } from '../list-of-values.service';
import { ToastrService } from 'ngx-toastr';

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
    // this.getLovList();
    console.log("shoLov", this.createdLov);
    if (this.createdLov) {
      this.sort();
    }
  }

  // public getLovList() {
  //   this.load = true;
  //   let options = {};
  //   options["tableId"] = this.tableId;
  //   options['columnName'] = this.column;
  //   this.listOfValuesService.getLov(options).subscribe(res => {
  //     this.createdLov = res['data'];
  //     console.log(this.createdLov, "showLov get updated data");
  //     this.load = false;
  //   })
  // }

  public deleteLov(id) {
    console.log("delete", id);
    // Utils.showSpinner();
    this.listOfValuesService.delLov(id).subscribe(response => {    //fetch updated list again
      this.toasterService.success("LOV deleted successfully")
    }, error => {
      this.toasterService.error(this.defaultError);
      this.delete.emit("deleted");
      // Utils.hideSpinner();
    });
  };

  onNoClick() {
    this.dialogRef.close();
  }

  editLov(item) {
  this.sendData.emit(item);
  }
  
}
