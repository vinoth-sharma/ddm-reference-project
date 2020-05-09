import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-help-modal',
  templateUrl: './disclaimer-help-modal.component.html',
  styleUrls: ['./disclaimer-help-modal.component.css']
})
export class DisclaimerHelpModalComponent implements OnInit {
  public disclaimerHelpDesc = "";
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


  constructor(public dialogRef: MatDialogRef<DisclaimerHelpModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    // console.log(this.data);
  }

  textChanged(event){
    console.log(event);
    
  }

  closeDailog(): void {
    this.dialogRef.close();
  }

}
