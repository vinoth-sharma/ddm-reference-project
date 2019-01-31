import { Component, OnInit, Input, Output, EventEmitter, ViewChild} from "@angular/core";

@Component({
  selector: "app-name-modal",
  templateUrl: "./name-modal.component.html",
  styleUrls: ["./name-modal.component.css"]
})

export class NameModalComponent implements OnInit {
  @ViewChild("nameRef") input;
 
  @Input() confirmHeader: string;
  @Input() confirmText: string;
  @Output() public saveData = new EventEmitter();
  @Output() public confirm = new EventEmitter();

  constructor() {}

  ngOnInit() {}

   /**
   * reset data
   */
  public reset() {
    this.input.nativeElement.value = "";
  }

  /**
   * update Data
   */
  public updateData(val){
    this.saveData.emit(val);
  }
}
