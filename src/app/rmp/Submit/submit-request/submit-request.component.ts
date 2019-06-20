import { Component, OnInit } from '@angular/core';
import { GeneratedReportService } from 'src/app/rmp/generated-report.service';


@Component({
  selector: 'app-submit-request',
  templateUrl: './submit-request.component.html',
  styleUrls: ['./submit-request.component.css']
})
export class SubmitRequestComponent implements OnInit {
  selectCriteria: boolean;
  update: boolean;


  constructor(private generated_id_service: GeneratedReportService) {

    this.generated_id_service.saveChanges.subscribe(element => {

      this.selectCriteria = element
      //console.log('SELECT CRITERIA')
      //console.log(this.selectCriteria)
      // generated_id_service.changeSavedChanges(!element)
    })


    this.generated_id_service.saveUpdate.subscribe(ele => {
      this.update = ele
    })
  }

  showReportId: string;
  showButton: boolean;



  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(true)
    })
  }



}
