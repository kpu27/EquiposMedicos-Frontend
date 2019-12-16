import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Swal from 'sweetalert2';
import { AppService } from 'src/app/services/app.service';
import { Settings } from '../../../app.settings.model';

@Component({
  selector: 'app-inventario-form',
  templateUrl: './inventario-form.component.html',
  styleUrls: ['./inventario-form.component.scss']
})
export class InventarioFormComponent implements OnInit {

  public serial = '';
  public marca = '';
  public modelo = '';
  public frecuenciaDias = '';
  public propiedades: Array<any> = [{propiedad: '', valor: ''}];
  settings: Settings;

  constructor(public dialogRef: MatDialogRef<InventarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appService: AppService) {
    }

  ngOnInit() {
    console.log(this.data);
    this.serial = this.data.serial;
  }

  public agregarPropiedad() {
    this.propiedades.push({propiedad: '', valor: ''});
  }

  public eliminarPropiedad(index: number) {
    this.propiedades.splice(index, 1);
  }

  public setValorPropiedad(index: number, event: any) {
    this.propiedades[index].propiedad = event;
  }

  public setValorV(index: number, event: any) {
    this.propiedades[index].valor = event;
  }

  public validarObservaciones(): boolean {
    let valid = false;
    if (this.propiedades.length > 0) {
      for (let index = 0; index < this.propiedades.length; index++) {
        const item = this.propiedades[index];
        if (item.propiedad !== '' && item.valor !== '') {
          valid = true;
        } else {
          valid = false;
        }
      }
    }
    return valid;
  }

  public setData() {
    return {
      idEquiposInventario: 0,
      fkEmpresa: this.data.empresa,
      fkCliente: this.data.cliente.idCliente,
      fkEquipos: this.data.equipo.idEquipos,
      serial: this.serial,
      marca: this.marca,
      modelo: this.serial,
      frecuenciaDias: this.frecuenciaDias,
      foto: 'none.jpg',
      propiedades: (JSON.stringify(this.propiedades)),
      estado: 1,
    };
  }

  public crear() {
    console.log(this.setData());


    if (this.validarObservaciones() === true) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Estas seguro de que quiere Registrar el Serial?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, Registrar',
        cancelButtonText: 'No, Cancelar',
      }).then((result) => {
        if (result.value) {
          console.log(this.setData());
          this.appService.openSpinner();
           this.appService.post('equiposInve/new', this.setData()).subscribe(
            (data: any) => {
              console.log(data),
              this.appService.closeSpinner();
              this.appService.showSuccess('Serial de Equipo Registrado!');
              this.close(1);
            }, error => {
              this.appService.closeSpinner();
              this.appService.showError('Error al Crear el Tercero');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
    } else {
      Swal.fire({
        type: 'warning',
        text: 'las propiedades deben ser validadas',
        timer: 3000,
        showConfirmButton: false,
      });
    }

  }

  public close(tipo: number): void {
    this.dialogRef.close({close: tipo, serial: this.serial, marca: this.marca, modelo: this.modelo});
  }

}
