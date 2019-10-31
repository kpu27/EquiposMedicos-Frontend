import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Input,
  Inject } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface OrdenDialog {
  orden: string,
  cotizacion: number,
  fechaCot: Date,
  cliente: string,
  tecnico: string,
  comentarios: string,
  fecha: Date,
  estado: number,
}

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {
  cotizacion: any;
  items: any;
  subTotal: Array<any> = [];
  monto: any = 0;
  active: boolean;
  form: FormGroup;
  submitted = false;
  emailInput: boolean;
  
  constructor(private api: AppService, public mgxSmartModalService: NgxSmartModalService, 
    private formBuilder: FormBuilder, public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any) { 
    this.active = true;
    this.emailInput = false;
    this.form = this.formBuilder.group({
      orden: ['', Validators.required],
      cotizacion: ['', Validators.required],
      fechaCot: ['', Validators.required],
      cliente: ['', [Validators.required, Validators.email]],
      tecnico: ['', [Validators.required, Validators.minLength(6)]],
      comentarios: ['', Validators.required],
      fechaEntrega: [false, Validators.requiredTrue],
      estado: ['', Validators.requiredTrue],
      
  });
  }

  ngOnInit() {

    this.form.patchValue({
      orden: this.data.numOrden,
      cotizacion: this.data.fkCotizacion.idCotizEncab,
      fechaCot: '',
      cliente: this.data.fkCotizacion.fkCliente.nombre,
      tecnico: this.data.fkCotizacion.responsable,
      comentarios: this.data.comentarios,
      fechaEntrega: this.data.fechaOrden,
      estado: this.data.esatdoOrden
    });
    this.form.disable();
    console.log(this.data);
/*     this.data = {
      cliente : "",
      
    } */
  }

  closeDialog(){
    this.dialogRef.close();
  }

  onClickedOutside(e: Event) {
    console.log('Clicked outside:', e);
    
  }

  enableInput(){
    this.form.enable()
  }

  saveInfo(){
    this.form.disable()
  }

  
  resetInputValues() {
    this.form.patchValue({
      orden: this.data.numOrden,
      cotizacion: this.data.fkCotizacion.idCotizEncab,
      fechaCot: '',
      cliente: this.data.fkCotizacion.fkCliente.nombre,
      tecnico: this.data.fkCotizacion.responsable,
      comentarios: this.data.comentarios,
      fecha: this.data.fechaOrden,
      estado: this.data.esatdoOrden
  });
    this.form.disable();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.form.value, null, 4));
}
  

}