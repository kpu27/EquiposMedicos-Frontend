import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AuthService } from 'src/app/services/auth.service';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
})
@Component({
  selector: 'app-protocolos-table',
  templateUrl: './protocolos-table.component.html',
  styleUrls: ['./protocolos-table.component.scss'],
  providers:[DatePipe]
})
export class ProtocolosTableComponent implements OnInit {
  public settings: Settings;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  public protocolos: any = [];
  public idProtocolo;
  public codigo;
  public nombre;
  public descripcion;
  @Input()
  public revision;
  public responsable;
  public usuario: any;
  public empresa: number;
  public estado = true;
  public tecnicos;
  public tipoForm: number;
  public estadoPro: number;
  public cols: any[];
  constructor(
    public appSettings: AppSettings,
    private service: AppService, 
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private auth: AuthService) {
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'idProtocolo',header: 'Id', width: '5%' },
      { field: 'codigo',header: 'Codigo', width: '15%' },
      { field: 'nombre',header: 'Nombre', width: '30%' },
      { field: 'revision',header: 'Revision', width: '15%' },
      { field: 'responsable',header: 'Responsable', width: '15%' },
      { field: 'estado',header: 'Estado', width: '10%' },
      { field: '',header: 'Accion', width: '10%' }
    ];
  }
  ngOnInit() {
    this.usuario = this.auth.getDataUsuario();
    this.empresa = this.usuario.empresa.idEmpresa;
    this.getProtocolos();
    this.datos = this._formBuilder.group({
      codigo: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
      descripcion: ['', Validators.compose([Validators.required])],
      revision: ['', Validators.compose([Validators.required])]
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
  public getDate(fecha: any){
    return this.datePipe.transform(fecha, 'yyyy-MM-dd')
  }
  public seleccionarProtocolo(protocolo) {
    this.datos.patchValue({
      codigo: protocolo.codigo,
      nombre: protocolo.nombre,
      descripcion: protocolo.descripcion,
      responsable: protocolo.responsable,
      revision: this.datePipe.transform(protocolo.revision, 'yyyy-MM-dd')
    });
    this.idProtocolo = protocolo.idProtocolo;
    this.empresa = protocolo.fkEmpresa.idEmpresa;
    this.estadoPro = protocolo.estado;
  }
  public getTecnicos() {
    this.service.get('tecnicos/list').subscribe(
      data => {
        this.tecnicos = data;
      }
    )
  }
  public getProtocolos() {
    this.service.get('protocolos/list').subscribe(
      data => {
        this.protocolos = data;
      },
      error => {
      }
    )
  }
  public newProtocolo() {

    swalWithBootstrapButtons.fire({
      text: 'Seguro de que quiere Crear el Protocolo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.empresa = this.usuario.empresa.idEmpresa;
        let datos = this.datos.value;
        let protocolo = {
          "fkEmpresa": this.empresa,
          'codigo': datos.codigo,
          'nombre': datos.nombre,
          'descripcion': datos.descripcion,
          'revision':  this.datePipe.transform(datos.revision, 'yyyy-MM-dd'),
          'responsable': this.usuario.nombre,
          'estado': 0
        }
        this.service.post('protocolos/new', protocolo).subscribe(
          data => {
            this.getProtocolos();
            this.estado = true;
            Swal.fire({
              type: 'success',
              text: 'el protocolo se creo con exito!',
              timer: 3000
            });
            this.getProtocolos();
          },
          error => {
          }
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
  public clear(){
    this.datos.reset();
  }
  public setTipoForm(tipo: number){
    this.tipoForm = tipo;
  }
  public updateProtocolo() {
    swalWithBootstrapButtons.fire({
      text: 'Seguro de que quiere Editar el Protocolo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        let datos = this.datos.value;
        let protocolo = {
          "fkEmpresa": this.empresa,
          'idProtocolo': this.idProtocolo,
          'codigo': datos.codigo,
          'nombre': datos.nombre,
          'descripcion': datos.descripcion,
          'revision': this.datePipe.transform(datos.revision, 'yyyy-MM-dd'),
          'responsable': this.usuario.nombre,
          'estado': this.estadoPro
        }
        this.service.put(`protocolos/${this.idProtocolo}`, protocolo).subscribe(
          data => {
            Swal.fire({
              type: 'success', text: 'el protocolo se edito con exito!', timer: 2000
            });
            this.estado = true;
            this.getProtocolos();
          }
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
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
  public deleteProtocolo() {
    let datos = this.datos.value;
    let protocolo = {
      "fkEmpresa": this.empresa,
      'idProtocolo': this.idProtocolo,
      'codigo': datos.codigo,
      'nombre': datos.nombre,
      'descripcion': datos.descripcion,
      'revision': this.datePipe.transform(datos.revision, 'yyyy-MM-dd'),
      'responsable': this.usuario.nombre,
      'estado': this.setEstdo(this.estadoPro)
    }
    Swal.fire({
      title: 'Advertencia',
      text: 'Estas seguro de que quiere '+this.setText(this.estadoPro)+' el protocolo?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, salir'
    }).then((result) => {
      if (result.value) {
        this.service.put(`protocolos/${this.idProtocolo}`, protocolo).subscribe(
          data => {
            Swal.fire({type:'success',text: 'La accione fue realizada', timer: 2000});
            this.getProtocolos();
            this.estado = true;
          },
          error => {
            Swal.fire(
              'Error!',
              'no se pudo  eliminar el protcolo'
            )
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
  public getStyle(style: string) {
    return style.toString();
  }
}