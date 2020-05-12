import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dealer-allocation',
  templateUrl: './dealer-allocation.component.html',
  styleUrls: ['./dealer-allocation.component.css']
})
export class DealerAllocationComp implements OnInit {
  constructor() { }

  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2016', '2017', '2018', '2019', '2020'];

  division = [{name: '001-Chevorlet (US)'}, {name: '004-Buick (US)'}, {name: '006-Cadillac (US)'}, {name: '012-GMC (US)'}];
  divisionSltd = [{name: '001-Chevorlet (US)'}, {name: '004-Buick (US)'}];

  modelYear = new FormControl();
  modelYears: string[] = ['2020', '2019', '2018', '2017'];

  allocGrp = new FormControl();
  allocGrps: string[] = ['BLAZER', 'BOLTEV', 'CAM', 'CAMCON', 'CAPTIM', 'CAPTIV', 'CCRUHD'];

  conData = new FormControl();
  conDatas: string[] = ['Estimated Shipments ', 'Final Allocation',  'Production Consensus (Approved Qty)', 'Monthly Demand', 'Unfufilled Demand', 'Dealer Declined Units']
  
  startDate = new FormControl();
  endDate = new FormControl();

  ngOnInit(): void {
  }

}
