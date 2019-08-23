import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-calendario-dialog',
  templateUrl: './calendario-dialog.component.html',
  styleUrls : ['./calendario-dialog.component.scss']
})
export class CalendarioDialogComponent implements OnInit {
  public form:FormGroup;
  constructor(public dialogRef: MatDialogRef<CalendarioDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({            
      'start': ['', Validators.required], 
      'isEdit' : false
    });
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data){
      this.form.patchValue({
        'title': this.data.title,
        'start': this.data.start,
        'end': this.data.end,
        'isEdit' : true
      })
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}