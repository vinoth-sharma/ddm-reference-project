import { Component, OnInit, ViewChild } from '@angular/core';
import Utils from 'src/utils';
import { DjangoService } from '../../django.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// Angular Component developed by Vinoth Sharma Veeramani

@Component({
  selector: 'app-existing-notes-container',
  templateUrl: './existing-notes-container.component.html',
  styleUrls: ['./existing-notes-container.component.css']
})
export class ExistingNotesContainerComponent implements OnInit {

  constructor(
    public django: DjangoService
  ) { }

  existingData = [];
  displayedColumns: string[] = ['notes_start_date', 'notes_end_date', 'notes_content'];

  dataSource = new MatTableDataSource<any>(this.existingData);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getPreviousNotesData();
  }

  getPreviousNotesData() {
    Utils.showSpinner();
    this.django.get_admin_notes().subscribe(response => {
      this.existingData = response['admin_notes'];
      this.dataSource = new MatTableDataSource<any>(this.existingData);
      this.dataSource.paginator = this.paginator;
      Utils.hideSpinner();
    })
  }

}
