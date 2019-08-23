import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-actividades-form',
  templateUrl: './actividades-form.component.html',
  styleUrls: ['./actividades-form.component.scss']
})
export class ActividadesFormComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ActividadesFormComponent>) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }

}
