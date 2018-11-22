import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  public isCollapsed = true;

  constructor() { }

  
  ngOnInit() {

    $(function() 
    {
      $("#deliv").change
      (
        function()
      {
        $('.metho').hide();
        $("#" + $(this).val()).show();
      }
      );
    }
      );
  

    //   $(function() 
    // {
    //   $("#custom").change
    //   (
    //     function()
    //   {
    //     $('.custom-dates').hide();
    //     $("#" + $(this).val()).show();
    //   }
    //   );
    // }
    //   );





  // $(
  //   function()
  // {
  //   $('.date').datepicker
  //   ({
  //   multidate: true,
  //   format: 'dd-mm-yyyy'
  //   });
  // });
  

}
}