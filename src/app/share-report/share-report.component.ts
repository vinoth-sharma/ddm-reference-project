import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-share-report',
  templateUrl: './share-report.component.html',
  styleUrls: ['./share-report.component.css']
})
export class ShareReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(function() {
      $('#delivery').change(function(){
          $('.method').hide();
          $("#" + $(this).val()).show();
      });
  });
  }

}
