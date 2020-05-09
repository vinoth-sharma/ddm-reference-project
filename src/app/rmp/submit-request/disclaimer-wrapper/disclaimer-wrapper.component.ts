import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerModalComponent } from '../disclaimer-modal/disclaimer-modal.component';

@Component({
  selector: 'app-disclaimer-wrapper',
  templateUrl: './disclaimer-wrapper.component.html',
  styleUrls: ['./disclaimer-wrapper.component.css']
})
export class DisclaimerWrapperComponent implements OnInit {

  public config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['image']
    ]
  };

  submitReqDesc = "";

  constructor(
    private dialog: MatDialog) {}

  ngOnInit(): void {
  }

  openDisclaimerModal(){
    this.dialog.open(DisclaimerModalComponent, {
      data: ""
    })
  }

  textChanged(){

  }
}
