import { Component, OnInit, Output, EventEmitter,ViewChild} from "@angular/core";

@Component({
  selector: "app-name-modal",
  templateUrl: "./name-modal.component.html",
  styleUrls: ["./name-modal.component.css"]
})
export class NameModalComponent implements OnInit {
  @Output() public saveData = new EventEmitter();
  @ViewChild("nameRef") input;

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
  public updateData(val) {
    this.saveData.emit(val);
  }
}
