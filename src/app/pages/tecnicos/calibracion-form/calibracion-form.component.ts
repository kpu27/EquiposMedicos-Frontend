import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-calibracion-form',
  templateUrl: './calibracion-form.component.html',
  styleUrls: ['./calibracion-form.component.scss']
})
export class CalibracionFormComponent implements OnInit {

  @Input() set calibracionvalid(val: number) {
    if (val === 1) {
      this.returCalibracion();
    }
    val = 0;
  }

  @Output() getCalibracion = new EventEmitter();
  public pruebas: Array<any> = [
    {equipo1: '', equipo2: '', patron1: '', patron2: '', desviacion1: '', desviacion2: ''},
    {equipo1: '', equipo2: '', patron1: '', patron2: '', desviacion1: '', desviacion2: ''},
  ];
  public repuestos: Array<any> = [
    { descripcion: '', referencia: '', cantidad: '' },
    { descripcion: '', referencia: '', cantidad: '' },
  ];
  public observaciones: Array<any> = [
    { nombre: '', descripcion: ''},
    { nombre: '', descripcion: ''},
  ];
  public lecturaEquipo: Array<any> = [];
  public lecturaPatron: Array<any> = [];
  public lecturadesviacion: Array<any> = [];
  public observ1 = '';
  public observ2 = '';
  public requiereAjuste = false;
  public promedio1 = '';
  public promedio2 = '';

  constructor(private appService: AppService) { }

  ngOnInit() {
  }

  public addPrueba() {
    this.pruebas.push({equipo1: '', equipo2: '', patron1: '', patron2: '', desviacion1: '', desviacion2: ''});
  }

  public deletePrueba(index: number) {
    this.pruebas.splice(index, 1);
  }

  public addRepuesto() {
    this.repuestos.push({ descripcion: '', referencia: '', cantidad: '' });
  }

  public deleteRepuesto(index: number) {
    this.repuestos.splice(index, 1);
  }

  public addObservacion() {
    this.observaciones.push({ nombre: '', descripcion: ''});
  }

  public deleteObservacion(index: number) {
    this.observaciones.splice(index, 1);
  }

  public setValorLetcuraEquipo1(index: number, event: any) {
    this.pruebas[index].equipo1 = event;
  }

  public setValorLetcuraEquipo2(index: number, event: any) {
    this.pruebas[index].equipo2 = event;
  }

  public setValorLetcuraPatron1(index: number, event: any) {
    this.pruebas[index].patron1 = event;
  }

  public setValorLetcuraPatron2(index: number, event: any) {
    this.pruebas[index].patron2 = event;
  }

  public setValorLetcuraDesviacion1(index: number, event: any) {
    this.pruebas[index].desviacion1 = event;
  }

  public setValorLetcuraDesviacion2(index: number, event: any) {
    this.pruebas[index].desviacion2 = event;
  }

  public setValorNombreObservacion(index: number, event: any) {
    this.observaciones[index].nombre = event;
  }

  public setValorNombreDescripcion(index: number, event: any) {
    this.observaciones[index].descripcion = event;
  }

  public evaluarPruebas() {
    if( this.pruebas.length > 0) {
      let count1 = 0;
      let count2 = 0;
      for (const item of this.pruebas) {
        count1 = count1 + parseInt(item.desviacion1);
        count2 = count2 + parseInt(item.desviacion2);
      }
      this.promedio1 = String((count1 /  this.pruebas.length));
      this.promedio2 = String((count2 /  this.pruebas.length));
    }
  }

  public resetPruebas() {
    this.promedio1 = '';
    this.promedio2 = '';
    this.pruebas = [{equipo1: '', equipo2: '', patron1: '', patron2: '', desviacion1: '', desviacion2: ''}];
  }

  public setRepuestoDescripcion(index: number, event: any) {
    this.repuestos[index].descripcion = event;
  }

  public setRepuestoReferecia(index: number, event: any) {
    this.repuestos[index].referencia = event;
  }

  public setRepuestoCantidad(index: number, event: any) {
    this.repuestos[index].cantidad = event;
  }

  public setLetcuraEquipo() {
    this.lecturaEquipo = [];
    for (const item of this.pruebas) {
      this.lecturaEquipo.push({equipo1: item.equipo1, equipo2: item.equipo2});
    }
    return JSON.stringify(this.lecturaEquipo);
  }

  public setLetcuraPatron() {
    this.lecturaPatron = [];
    for (const item of this.pruebas) {
      this.lecturaPatron.push({patron1: item.patron1, patron2: item.patron2});
    }
    return JSON.stringify(this.lecturaPatron);
  }

  public setLetcuraDesviacion() {
    this.lecturadesviacion = [];
    for (const item of this.pruebas) {
      this.lecturadesviacion.push({desviacion1: item.desviacion1, desviacion2: item.desviacion2});
    }
    return JSON.stringify(this.lecturadesviacion);
  }

  public setPromedio() {
    return JSON.stringify({promedio1: this.promedio1, promedio2: this.promedio2});
  }

  public setRepuestos() {
    return JSON.stringify(this.repuestos);
  }

  public setObservaciones() {
    return JSON.stringify(this.observaciones);
  }

  public setData() {
    return {
      idCalibracion: 0,
      lecEquipo: this.setLetcuraEquipo(),
      lecPatron: this.setLetcuraPatron(),
      lecDesviacion: this.setLetcuraDesviacion(),
      observaciones: this.setObservaciones(),
      promedio: this.setPromedio(),
      requiereAjuste: this.requiereAjuste,
      repuestos: this.setRepuestos(),
    };
  }

  public validarPruebas(): boolean {
    let valid = false;
    if (this.pruebas.length > 0) {
      for (let index = 0; index < this.pruebas.length; index++) {
        const item = this.pruebas[index];
        if (
          item.equipo1 !== '' &&
          item.equipo2 !== '' &&
          item.patron1 !== '' &&
          item.patron2 !== '' &&
          item.desviacion1 !== '' &&
          item.desviacion2 !== '' ) {
          valid = true;
        } else {
          valid = false;
        }
      }
    }
    return valid;
  }

/*   public validarRepuestos(): boolean {
    let valid = false;
    if (this.repuestos.length > 0) {
      for (let index = 0; index < this.repuestos.length; index++) {
        const item = this.repuestos[index];
        if (item.descripcion !== '' && item.referencia !== '' && item.cantidad !== '' ) {
          valid = true;
        } else {
          valid = false;
        }
      }
    }
    return valid;
  } */

  public validarObservaciones(): boolean {
    let valid = false;
    if (this.observaciones.length > 0) {
      for (let index = 0; index < this.observaciones.length; index++) {
        const item = this.observaciones[index];
        if (item.nombre !== '' && item.descripcion !== '') {
          valid = true;
        } else {
          valid = false;
        }
      }
    }
    return valid;
  }

  public returCalibracion() {
    console.log(this.setData());
    if (this.validarPruebas() === true && this.validarObservaciones() === true) {
      this.getCalibracion.emit({valid: true, calibracion: this.setData()});
    } else {
      this.getCalibracion.emit({valid: false});
    }
  }

}
