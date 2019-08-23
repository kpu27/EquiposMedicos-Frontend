import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  providers: [DatePipe]
})
export class ScheduleDialogComponent implements OnInit {
  public form:FormGroup;
  fechaProgramada: string;
  constructor(public dialogRef: MatDialogRef<ScheduleDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private datePipe: DatePipe,
              public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({ 
      'titulo': ['', Validators.required],            
      'start': ['', Validators.required], 
      'isEdit' : false
    });
  }

  ngOnInit() {
    if (this.data){
      console.log(this.data);
      this.form.patchValue({
        'titulo': this.data.title,
        'start': this.data.start,
        'isEdit' : true
      })
    }
    this.getDate();
  }

  getDate() {
    this.fechaProgramada = this.datePipe.transform(this.data.fechaProgramada, 'yyyy-MM-dd');
  }

  close(): void {
    this.dialogRef.close();
  }

}