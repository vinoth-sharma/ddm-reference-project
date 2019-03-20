import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})

export class ConfirmModalComponent implements OnInit {

  @Output() public confirm = new EventEmitter();
  @Input() confirmText: string;
  @Input() confirmHeader: string = this.confirmHeader || 'Confirmation';
  @Input() customId: string = this.customId || 'confirmationModal';

  constructor() { }

  ngOnInit() { }

  public onConfirm() {
    if (this.confirm.observers.length) {
      this.confirm.emit();
    }
  }
}