import { Component, OnInit } from '@angular/core';
import { ReportbuilderService } from '../reportbuilder.service';
import { FormBuilder, FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-semantic-reports',
  templateUrl: './semantic-reports.component.html',
  styleUrls: ['./semantic-reports.component.css']
})
export class SemanticReportsComponent implements OnInit {
  response : any;
  form: FormGroup;
  orders : any;

  constructor(private svc : ReportbuilderService,private formBuilder: FormBuilder) {
    this.svc.task().subscribe((resp)=>{
      this.orders = resp;
      console.log(this.orders);
      const controls = this.orders.map(c => new FormControl(false));  
      controls[0].setValue(true); // Set the first checkbox to true (checked)
      this.form = this.formBuilder.group({
        orders: new FormArray(controls)
      });
    })
   }

  ngOnInit() {
  }

  submit() {
    const selectedOrderIds = this.form.value.orders
      .map((v, i) => v ? this.orders[i].id : null)
      .filter(v => v !== null);

    console.log(selectedOrderIds);
  }

}
