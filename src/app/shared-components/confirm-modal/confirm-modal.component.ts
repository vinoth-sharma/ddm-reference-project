import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})

export class ConfirmModalComponent implements OnInit {

  @Output() public confirm = new EventEmitter();
  @Input() confirmText: string;
  @Input() confirmHeader: string;
  @Input() customId: string;

  constructor() { }

  ngOnInit() { }

  ngOnChanges(){
    this.confirmHeader = this.confirmHeader && this.confirmHeader.length > 0?this.confirmHeader:"Confirmation";
    this.customId = this.customId && this.customId.length > 0?this.customId:"confirmationModal";
  }

  public onConfirm() {
    if (this.confirm.observers.length) {
      this.confirm.emit();
    }
  }
}