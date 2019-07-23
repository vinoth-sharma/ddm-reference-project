import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from "@angular/core";

@Component({
  selector: "app-saveAs-modal",
  templateUrl: "./saveAs-modal.component.html",
  styleUrls: ["./saveAs-modal.component.css"]
})

export class SaveAsModalComponent implements OnInit {
  @ViewChild("nameRef") input;
 
  @Input() title: string;
  @Input() query: string;
  @Input() inputLabel: string;
  @Input() inputValue: string;
  @Output() public saveData = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  ngOnChanges(){
    this.reset();
  }

   /**
   * reset data
   */
  public reset() {
    this.input.nativeElement.value = this.inputValue || "";
  }

  /**
   * update Data
   */
  public updateData(val){
    this.saveData.emit(val);
  }

}
