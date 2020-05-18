import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SubmitRequestService } from '../submit-request.service';
import { NgToasterComponent } from 'src/app/custom-directives/ng-toaster/ng-toaster.component';
import { DjangoService } from '../../django.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-request-onbehalf',
  templateUrl: './request-onbehalf.component.html',
  styleUrls: ['./request-onbehalf.component.css']
})
export class RequestOnbehalfComp implements OnInit {

  constructor(public dialogRef: MatDialogRef<RequestOnbehalfComp>,
    private subReqService: SubmitRequestService,
    private toaster: NgToasterComponent,
    private django: DjangoService) { }

  dl_list = [];

  myControl = new FormControl();
  filteredOptions: Observable<any>;
  public noneOpt = {
    fullName: "None",
    nameLabel: "None",
    emailId: "",
    users_table_id: null
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.fullName),
        map(name => name ? this._filter(name) : this.dl_list.slice())
      );

    let lookTableData = this.subReqService.getLookUpTableData();

    let l_dl_list = lookTableData['users_list'];
    this.dl_list = l_dl_list.map(ele => {
      return {
        fullName: ele.first_name + ' ' + ele.last_name,
        nameLabel: ele.first_name + ' ' + ele.last_name + ' (' + ele.email + ')',
        emailId: ele.email,
        users_table_id: ele.users_table_id
      }
    })
    this.myControl.setValue(this.subReqService.getSubmitOnBehalf())
  }

  confirmUser() {
    if (!this.myControl.value) {
      this.toaster.error("Please select the user")
    }
    else if (this.myControl.value) {
      let selected = this.myControl.value.fullName === "None" ? {} : this.myControl.value;
      this.subReqService.setSubmitOnBehalf(selected);
      this.closeDailog();
    }
  }




  displayFn(user): string {
    return user && user.fullName ? user.fullName : '';
  }

  private _filter(name: string) {
    const filterValue = name.toLowerCase();

    return this.dl_list.filter((option: any) => option.nameLabel.toLowerCase().indexOf(filterValue) === 0);
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}
