import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
})
@Component({
  selector: 'app-instrumentos-list',
  templateUrl: './instrumentos-list.component.html',
  styleUrls: ['./instrumentos-list.component.scss']
})
export class InstrumentosListComponent implements OnInit {
  public settings: Settings;
  public instrumentos: any;
  public estado: boolean;
  public lista: string;
  public protocolos: any;
  public protocolos2: any;
  public protocolo: any;
  public cols: any[];
  public table: number;
  public instrumento: any;
  public selectinstrumento: any;
  public vacion: boolean;
  public actualizar: any;
  public usuario: any;
  public idInstrumentos: any;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  public tipoForm: number;
  public tipoList: number;
  public fkEmpresa: number;
  public idInstrumento: number;
  public instrumentoSelected: string;
  public estadoIns: number; 
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  limls: { field: string; header: string; }[];
  constructor(
    public appSettings: AppSettings,
    private _formBuilder: FormBuilder,
    private _AppService: AppService,
    public servicio: AuthService) {
    this.settings = this.appSettings.settings
    this.estado = true;
    this.vacion = false;
    this.tipoList = 0;
    this.cols = [
      { field: 'idInstrumentos', header: 'Id', width: '5%' },
      { field: 'nombre', header: 'Nombre', width: '25%' },
      { field: 'marca', header: 'Marca', width: '20%' },
      { field: 'modelo', header: 'Modelo', width: '15%' },
      { field: 'estado', header: 'Estado', width: '15%' },
      { field: 'accion', header: 'Acccion', width: '20%' }
    ];
  }
  ngOnInit() {
    this.getInstrumentos();
    this.usuario = this.servicio.getDataUsuario();
    this.datos = this._formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      modelo: ['', Validators.compose([Validators.required])],
      marca: ['', Validators.compose([Validators.required])]
    });
    this.datos.valueChanges.subscribe(() => {
      this.datoschanged = true;
      let times: number = 0;
      let veces: number = 0;
      (<any>Object).values(this.datos.controls).forEach(control => {
        (<any>Object).values(this.datos).forEach(data => {
          if (veces == times) {
            if (control.value != data) {
              this.datoschanged = false;
            }
          }
          veces++;
        });
        veces = 0;
        times++;
      });
    });
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  public fieldValidation(datos: FormGroup, name: any) {
    if (datos.get([name]).invalid && datos.get([name]).touched) {
      return true;
    }
  }
  public setTipoForm(tipo: number) {
    this.tipoForm = tipo;
  }
  public setTipoList(tipo: number) {
    this.tipoList = tipo;
  }
  public SelectIntrumento(selec: any) {
    this.selectinstrumento = selec;
  }
  public getProtocolosPorInstrumento(e) {
    this.instrumentoSelected = e.nombre;
    this.protocolos = [];
    this.settings.loadingSpinner = true;
    this._AppService.get('ip/' + this.usuario.empresa.idEmpresa + '/instrumento/'.concat(e.idInstrumentos)).subscribe(
      (result: any) => {
        this.protocolos = result;
        this.settings.loadingSpinner = false;
        if (result.length > 0) {
          Swal.fire({ type: 'success', text: 'listado de protocolos!', timer: 2000 });
        } else {
          Swal.fire({ type: 'error', text: 'No se Obtuvieron datos!', timer: 2000 });
        }
      },
      error => {
        this.settings.loadingSpinner = false;
        Swal.fire({ type: 'error', text: 'error al realizar la consulta!', timer: 2000 });
      });
  }
  public getProtocolos() {
    this.settings.loadingSpinner = true;
    this._AppService.get(`protocolos/list`).subscribe(
      result => {
        this.protocolos2 = result;
        this.settings.loadingSpinner = false;
        Swal.fire({ type: 'success', text: 'listado de Protocolos!', timer: 2000 });
      },
      error => {
        this.settings.loadingSpinner = false;
      });
  }
  public SeleInstrumento(instrumento: any) {
    this.datos.patchValue({
      nombre: instrumento.nombre,
      marca: instrumento.marca,
      modelo: instrumento.modelo
    });
    this.idInstrumento = instrumento.idInstrumentos;
    this.fkEmpresa = instrumento.fkEmpresa.idEmpresa;
    this.estadoIns = instrumento.estado;
  }
  public clear() {
    this.datos.reset();
  }
  public putInstrumento() {
    swalWithBootstrapButtons.fire({
      text: 'Seguro de que quiere Editar el Instrumento?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        let datos = this.datos.value;
        let instrumento = {
          "idInstrumentos": this.idInstrumento,
          "nombre": datos.nombre,
          "marca": datos.marca,
          "modelo": datos.modelo,
          "fkEmpresa": this.fkEmpresa,
          "estado": this.estadoIns
        }
        this._AppService.put('instrumentos/' + this.idInstrumento, instrumento).subscribe(
          result => {
            this.estado = true;
            Swal.fire({ type: 'success', text: 'Instrumento editado con Exito!', timer: 3000 });
            this.getInstrumentos();
            this.clear();
          }
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
  public postInstrumentos() {
    swalWithBootstrapButtons.fire({
      text: 'Seguro de que quiere crear el Instrumento?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        let datos = this.datos.value;
        let instrumento = {
          "nombre": datos.nombre,
          "marca": datos.marca,
          "modelo": datos.modelo,
          "fkEmpresa": this.usuario.empresa.idEmpresa,
          "estado": 0
        }
        this._AppService.post('instrumentos/new', instrumento).subscribe(
          result => {
            Swal.fire({ type: 'success', text: ': El instrumento fue creado con exito!', timer: 3000 });
            this.instrumento = result
            this.estado = true;
            this.getInstrumentos();
            this.datos.reset();
          }
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
  public getInstrumentos() {
    this.settings.loadingSpinner = true;
    this._AppService.get(`instrumentos/list`).subscribe(
      result => {
        this.settings.loadingSpinner = false;
        this.instrumentos = result;
      },
      error => {
        this.Toast.fire({ type: 'error', title: 'Ha ocurrido un error en la consulta' })
      });
  }
  public setEstdo(estado: number): number{
    switch (estado) {
      case 0:
        estado = 9;
        return estado;
        break;
      case 9:
        estado = 0;
        return estado;
      default:
        break;
    }
 }
 public setText(estado: number): string{
   switch (estado) {
     case 0:
       return 'desactivar';
       break;
     case 9:
       return 'reactivar';
     default:
       break;
   }
 }
 public deleteInstrumento() {
    Swal.fire({
      title: 'Advertencia',
      text: 'Estas seguro de que quiere '+this.setText(this.estadoIns)+' el protocolo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, salir'
    }).then((result) => {
      if (result.value) {
        let datos = this.datos.value;
        let instrumento = {
          "idInstrumentos": this.idInstrumento,
          "nombre": datos.nombre,
          "marca": datos.marca,
          "modelo": datos.modelo,
          "fkEmpresa": this.fkEmpresa,
          "estado": this.setEstdo(this.estadoIns)
        }
        this._AppService.put('instrumentos/' + this.idInstrumento, instrumento).subscribe(
          result => {
            Swal.fire({ type: 'success', text: 'Accion reLalizada!', timer: 3000 });
            this.getInstrumentos();
            this.clear();
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
  public addProtocolo(idpro) {
    swalWithBootstrapButtons.fire({
      text: 'Seguro de que quiere agregarle el Protocolo al Instrumento ' + this.instrumentoSelected + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        const json = {
          "fkEmpresa": parseInt(this.usuario.empresa.idEmpresa),
          "fkInstrumento": this.idInstrumento,
          "fkProtocolo": idpro,
        }
        this._AppService.post('instrumentos_protocolo/new', json).subscribe(
          data => {
            Swal.fire({ type: 'success', text: 'se agrego el protocolo al instrumento ' + this.instrumentoSelected + '!', timer: 3000 });
            this.getInstrumentos();
            this.tipoList = 0;
          }
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
  public setIdInstrumento(instrumento: any) {
    this.idInstrumento = instrumento.idInstrumentos;
    this.instrumentoSelected = instrumento.nombre;
  }
  public getStyle(style: string) {
    return style.toString();
  }
}
