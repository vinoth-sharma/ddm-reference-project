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
  showReportId: string;
  showButton: boolean;

  constructor(private generated_id_service: GeneratedReportService) {
    this.generated_id_service.saveChanges.subscribe(element => {
      this.selectCriteria = element
    })

    this.generated_id_service.saveUpdate.subscribe(ele => {
      this.update = ele
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.generated_id_service.changeButtonStatus(true)
    })
  }
}
