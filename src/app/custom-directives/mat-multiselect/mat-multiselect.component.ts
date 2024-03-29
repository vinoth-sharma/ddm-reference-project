import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
declare var document: any;

@Component({
  selector: 'app-mat-multiselect',
  templateUrl: './mat-multiselect.component.html',
  styleUrls: ['./mat-multiselect.component.css']
})
export class MatMultiselect implements OnInit {
  @Input() data: Array<{}>;
  @Input() settings: any;

  @Input() inputModel: Array<{}>;
  @Output() inputModelChange = new EventEmitter();
  @Output() selectionDone = new EventEmitter();

  @ViewChild(MatSelect) matSelect: MatSelect;
  toppings = new FormControl();

  public l_data = [];
  public searched_data = [];
  public selectAll = [2];
  public l_db = [];
  public sortApplicableArr = ["Region", "Zone", "Area", "GMMA", "LMA", "Vehicle Line Brands", "Allocation Groups",
    "Merchandising Models", "Order Types"]

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.matSelect.openedChange.subscribe(opened => {
      if (!opened) {
        let op = this.getOutput()
        this.inputModelChange.emit(op);
        this.selectionDone.emit(op)
      }
      else {
        this.onKey("");
        document.getElementById("multiInput").value = "";
        this.selectAllBoxValidate()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data || changes.inputModel) {
      if (this.data.length) {
        this.l_data = JSON.parse(JSON.stringify(this.data));
        this.l_db = this.inputModel ? this.inputModel.map(ele => ele[this.settings.primary_key]) : [];

        //remove selcted items which is not present in master data
        this.l_db = this.l_db.filter(value => {
          if (this.l_data.some(ele => ele[this.settings.primary_key] === value))
            return value
        })

        this.searched_data = JSON.parse(JSON.stringify(this.l_data));

        this.searched_data.forEach(element => {
          element['checked'] = this.l_db.includes(element[this.settings.primary_key])
        });
        this.selectAllBoxValidate()
      }
      else if (this.data.length === 0) {
        this.searched_data = [];
        this.l_db = [];
        this.l_data = [];
      }
    }
  }

  public onKey(value) {
    if (value === '') {
      this.searched_data = [...this.l_data];
      this.searched_data.forEach(element => {
        element['checked'] = this.l_db.includes(element[this.settings.primary_key])
      });
    } else {
      this.searched_data = this.search(value);
    }
    this.stabilizeData();
    this.selectAllBoxValidate()
  }

  public search(value: string) {
    let filter = value.toLowerCase();
    return this.l_data.filter(option => option[this.settings.label_key].toLowerCase().includes(filter));
  }

  public toggleAllSelection(event) {
    if (this.selectAll.length > 1) {
      this.searched_data.forEach(element => {
        this.addSelection(element[this.settings.primary_key]);
      });
    }
    else {
      this.searched_data.forEach(element => {
        this.removeSelection(element[this.settings.primary_key]);
      });
    }
    this.stabilizeData();
  }

  public checkedBox(event) {
    if (event.checked)
      this.addSelection(event.source.value)
    else if (!event.checked)
      this.removeSelection(event.source.value)

    this.stabilizeData();
    this.selectAllBoxValidate()
  }

  public selectAllBoxValidate() {
    if (this.searched_data.every(ele => this.l_db.includes(ele[this.settings.primary_key])))
      this.selectAll = [0, 2]
    else
      this.selectAll = [2]
  }

  public stabilizeData() {
    this.searched_data.forEach(element => {
      element['checked'] = this.l_db.includes(element[this.settings.primary_key])
    });
  }

  public removeSelection(value) {
    const index = this.l_db.indexOf(value);
    if (index > -1) {
      this.l_db.splice(index, 1);
    }
  }

  public addSelection(value) {
    this.l_db.push(value);
    this.l_db = [...new Set(this.l_db)]
  }

  public getOutput() {
    let output = this.data.filter(ele => {
      if (this.l_db.includes(ele[this.settings.primary_key]))
        return ele
    })
    output.forEach(ele => delete ele['checked'])
    return output
  }

  public getTitle() {
    if (this.l_db.length) {
      let op = this.data.filter(ele => {
        if (this.l_db.includes(ele[this.settings.primary_key]))
          return ele
      })
      let f: any = op.reduce((a: any, b: any) => {
        return { [this.settings.label_key]: a[this.settings.label_key] + ',' + b[this.settings.label_key] }
      })
      return f[this.settings.label_key]
    }
    else {
      return this.settings.label
    }
  }
}

