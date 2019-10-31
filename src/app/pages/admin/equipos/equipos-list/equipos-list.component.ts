import Swal from 'sweetalert2';
import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import { MatDialog } from '@angular/material';
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
  selector: 'app-equipos-list',
  templateUrl: './equipos-list.component.html',
  styleUrls: ['./equipos-list.component.scss']
})
export class EquiposListComponent implements OnInit {
  public equipos: any;
  public parametro: any;
  public protocolos: any;
  public estado: boolean;
  public usuario: Usuario;
  public equipo: any;
  public putEquip: any
  public idEquipos: any;
  public para: any;
  public settings: Settings;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  public fkEmpresa: number;
  public idEquipo: number;
  public estadoEquipo: number;
  public tipoForm: number;
  public cols: any[];
  public tipoEquipos = 0;
  public show:boolean = true;
  constructor(
    private _formBuilder: FormBuilder,
    private service: AppService,
    private servicio: AuthService,
    public appSettings: AppSettings ) {
    this.estado = true;
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'idEquipos',header: 'Id', width: '10%' },
      { field: 'codigo',header: 'Codigo', width: '15%' },
      { field: 'referencia',header: 'Referencia', width: '15%' },
      { field: 'nombre',header: 'Nombre', width: '30%' },
      { field: 'estado',header: 'Estado', width: '15%' },
      { field: '',header: 'Accion', width: '15%' }
    ];
  }
  ngOnInit() {
    this.usuario = this.servicio.getDataUsuario();
    this.getProtocolos();
    this.getParametro();
    this.getEquipos();
    this.datos = this._formBuilder.group({
      fkProtocolo: ['', Validators.compose([Validators.required])],
      fkParametro: ['', Validators.compose([Validators.required])],
      codigo: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
      referencia: ['', Validators.compose([Validators.required])]
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
  public getEquipos() {
    this.settings.loadingSpinner = true;
    this.service.get(`equipos/list/`+this.usuario.empresa.idEmpresa).subscribe(
      result => {
        this.equipos = result;
        this.settings.loadingSpinner = false;
      });
  }
  public setEquipo(equipos: any) {
    this.datos.patchValue({
      fkParametro: equipos.fkTipo,
      fkProtocolo: equipos.fkProtocolo.idProtocolo,
      codigo: equipos.codigo,
      nombre: equipos.nombre,
      referencia: equipos.referencia
    });
    this.idEquipo = equipos.idEquipos;
    this.fkEmpresa = equipos.fkEmpresa.idEmpresa;
    this.estadoEquipo = equipos.estado;
  }
  public putEquipo() {
    if (this.datos.valid) {
      swalWithBootstrapButtons.fire({
        text: 'Seguro de que quiere Editar el Equipo?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          let datos = this.datos.value;
          let equipo = {
            "idEquipos": this.idEquipo,
            "fkEmpresa": this.fkEmpresa,
            "nombre": datos.nombre,
            "fkProtocolo": parseInt(datos.fkProtocolo),
            "fkTipo": parseInt(datos.fkParametro),
            "referencia": datos.referencia,
            "codigo": datos.codigo,
            "estado": this.estadoEquipo
          }
          this.service.put('equipos/' + this.idEquipo, equipo).subscribe(
            result => {
              this.estado = true;
              this.getEquipos();
              Swal.fire({ type: 'success', text: 'Equipos Ediatdo con Exito!', timer: 3000 });
            }, error => { console.log(error) }
          );
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      })
    }
  }
  public getProtocolos() {
    this.service.get('protocolos/list').subscribe(
      result => {
        this.protocolos = result;
      },
      error => {
        console.log(error);
      });
  }
  public clear() {
    this.datos.reset();
  }
  public postEquipo() {
    if (this.datos.valid) {
      swalWithBootstrapButtons.fire({
        text: 'Seguro de que quiere Crear el Equipo?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          let datos = this.datos.value;
          let equipo = {
            "estado": 1,
            "fkEmpresa": this.usuario.empresa.idEmpresa,
            "fkProtocolo": parseInt(datos.fkProtocolo),
            "fkTipo": parseInt(datos.fkParametro),
            "referencia": datos.referencia,
            "codigo": datos.codigo,
            "nombre": datos.nombre
          }
          this.service.post('equipos/new', equipo).subscribe(
            resutl => {
              this.estado = true
              this.getEquipos();
              Swal.fire({ type: 'success', text: 'Equipo creado con exito!', timer: 3000 });
            }
          )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      })
    }
  }
  public getParametro() {
    this.service.get('parametro/filtro_empresa_grupo/' + this.usuario.empresa.idEmpresa + '/2').subscribe(
      result => {
        this.parametro = result
      }
    )
  }
  public setEstdo(estado: number): number {
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
  public setText(estado: number): string {
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
  public deleteEquipo() {
    Swal.fire({
      title: 'Advertencia',
      text: 'Estas seguro de que quiere ' + this.setText(this.estadoEquipo) + ' el equipos?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        let datos = this.datos.value;
        let equipo = {
          "idEquipos": this.idEquipo,
          "fkEmpresa": this.fkEmpresa,
          "nombre": datos.nombre,
          "fkProtocolo": parseInt(datos.fkProtocolo),
          "fkTipo": parseInt(datos.fkParametro),
          "referencia": datos.referencia,
          "codigo": datos.codigo,
          "estado":  this.setEstdo(this.estadoEquipo)
        };
        this.service.put('equipos/'+this.idEquipo, equipo).subscribe(
          data => {
            Swal.fire({ type: 'success', text: 'Accion realizada', timer: 2000 });
            this.getEquipos();
          }
        )

      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
  public getStyle(style: string) {
    return style.toString();
  }
}
