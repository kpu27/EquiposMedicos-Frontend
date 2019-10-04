import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
})
@Component({
  selector: 'app-tecnicos-table',
  templateUrl: './tecnicos-table.component.html',
  styleUrls: ['./tecnicos-table.component.scss']
})
export class TecnicosTableComponent implements OnInit {
  public tecnicos;
  public estado: boolean;
  public agregarTecnico: any;
  public actualizar: any;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  public tipoForm: number;
  public estadoUsuario: number;
  public delete: any;
  private idTecnico: number;
  private idEmpresa: number;
  public estadoTec: number;
  public usuario: any;
  public settings: Settings;
  public cols: any[];
  public roles: Array<any> = [];
  public userRol: Array<any> = [];
  constructor(public appSettings: AppSettings, private service: AppService, private _formBuilder: FormBuilder, private servicio: AuthService) {
    this.estado = true;
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'idTecnico', header: 'Item', width: '5%' },
      { field: 'documento', header: 'Cedula', width: '10%' },
      { field: 'nombre', header: 'Nombre', width: '20%' },
      { field: 'telefonoCelular', header: 'Telefono', width: '10%' },
      { field: 'email', header: 'Correo', width: '20%' },
      { field: 'estado', header: 'Estado', width: '10%' },
      { field: '', header: 'Accion', width: '10%' }
    ];
  }
  ngOnInit() {
    this.getTecnicos();
    this.usuario = this
    this.datos = this._formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      nombreCorto: ['', Validators.compose([Validators.required])],
      direccion: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      ciudad: ['', Validators.compose([Validators.required])],
      documento: ['', Validators.compose([Validators.required])],
      telefonoCelular: ['', Validators.compose([Validators.required])],
      telefonoFijo: ['', Validators.compose([Validators.required])]
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
  
  public fieldValidation(datos: FormGroup, name: any) {
    if (datos.get([name]).invalid && datos.get([name]).touched) {
      return true;
    }
  }
  public setTipoForm(tipo: number) {
    this.tipoForm = tipo;
  }
  public postagregarTecnicos() {
    if (this.datos.valid) {
      swalWithBootstrapButtons.fire({
        text: 'Seguro de que quiere Crear el Tecnico?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          let datos = this.datos.value;
          let tecnico = {
            "idTecnico": 50,
            "nombre": datos.nombre,
            "nombreCorto": datos.nombreCorto,
            "documento": datos.documento,
            "direccion": datos.direccion,
            "email": datos.email,
            "ciudad": datos.ciudad,
            "telefonoFijo": datos.telefonoFijo,
            "telefonoCelular": datos.telefonoCelular,
            "fkEmpresa": this.usuario.empresa.idEmpresa,
            "fkUsuario": null,
            "estado": 1
          }
          let usuario = {
            "nombre": datos.nombre,
            "apellido": datos.nombreCorto,
            "documento": datos.documento,
            "email": datos.email,
            "enabled": 1,
            "username": datos.nombreCorto,
            "fkEmpresa": this.usuario.empresa.idEmpresa,
            "expirado": 1,
            "roles": [{ "id": 1, "nombre": "ROLE_TECNICO" }],
            "foto": '',
            "password": datos.documento
          }
          const newUser = {
            "apellido": datos.nombreCorto,
            "email": datos.email,
            "nombre": datos.nombre,
            "password": datos.documento,
            "username": datos.nombreCorto,
            "documento": datos.documento,
            "fkEmpresa": this.usuario.empresa.idEmpresa,
            "enabled": 0,
            "expirado": 0
          }
          this.service.post('tecnicos/new', tecnico).subscribe(
            result => {
              this.agregarTecnico = result;
              this.service.post('usuarios/new', newUser).subscribe(
                (result: any) => {
                  tecnico.fkUsuario = result.fkUsuario;
                  this.service.put('tecnicos/' + result.idTecnico, tecnico).subscribe(
                    result => {
                      Swal.fire({ type: 'success', text: 'Tecnico Creado con Exito!', timer: 3000 });
                      this.estado = true;
                      this.getTecnicos();
                    },
                    error => {
                      console.log(error);
                      Swal.fire({ type: 'error', text: 'Error al Crear el Tecnico', timer: 2000 });
                    }
                  )
                },
              )
            }
          )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      })
    }
  }
  public clear() {
    this.datos.reset();
  }
  public SeleTecnico(tecnico: any) {
    this.datos.patchValue({
      nombre: tecnico.nombre,
      nombreCorto: tecnico.nombreCorto,
      direccion: tecnico.direccion,
      telefonoFijo: tecnico.telefonoFijo,
      telefonoCelular: tecnico.telefonoCelular,
      email: tecnico.email,
      ciudad: tecnico.ciudad,
      documento: tecnico.documento,
    });
    this.idTecnico = tecnico.idTecnico;
    this.idEmpresa = tecnico.fkEmpresa.idEmpresa;
    this.estadoTec = tecnico.estado;
  }
  public editarTecnicos() {
    if (this.datos.valid) {
      swalWithBootstrapButtons.fire({
        text: 'Seguro de que quiere Editar el Tecnico?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          let datos = this.datos.value;
          let tecnico = {
            "idTecnico": this.idTecnico,
            "documento": datos.documento,
            "nombre": datos.nombre,
            "nombreCorto": datos.nombreCorto,
            "direccion": datos.direccion,
            "telefonoFijo": datos.telefonoFijo,
            "telefonoCelular": datos.telefonoCelular,
            "email": datos.email,
            "ciudad": datos.ciudad,
            "estado": this.estadoTec,
            "fkEmpresa": this.idEmpresa
          }
          this.service.put('tecnicos/' + this.idTecnico, tecnico).subscribe(
            result => {
              Swal.fire({ type: 'success', text: 'Tecnico Editado con Exito!', timer: 3000 });
              this.estado = true;
              this.getTecnicos();
            }
          )
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
        }
      })

    }
  }
  public getTecnicos() {
    this.service.get('tecnicos/list').subscribe(
      data => {
        this.tecnicos = data;
      },
      err => {
        console.log(err);
      }
    )
  }
  public success(title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: 'success',
      title: 'El tecnico fue agregado con exito!'
    })
  }
  public setEstdo(estado: number): number {
    switch (estado) {
      case 1:
        estado = 9;
        return estado;
        break;
      case 9:
        estado = 1;
        return estado;
      default:
        break;
    }
  }
  public setText(estado: number): string {
    switch (estado) {
      case 1:
        return 'desactivar';
        break;
      case 9:
        return 'reactivar';
      default:
        break;
    }
  }
  public deleteTecnico() {
    swalWithBootstrapButtons.fire({
      text: 'Seguro de que quiere ' + this.setText(this.estadoTec) + ' al Tecnico?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        let datos = this.datos.value;
        let tecnico = {
          "idTecnico": this.idTecnico,
          "documento": datos.documento,
          "nombre": datos.nombre,
          "nombreCorto": datos.nombreCorto,
          "direccion": datos.direccion,
          "telefonoFijo": datos.telefonoFijo,
          "telefonoCelular": datos.telefonoCelular,
          "email": datos.email,
          "ciudad": datos.ciudad,
          "estado": this.setEstdo(this.estadoTec),
          "fkEmpresa": this.idEmpresa
        }
        this.service.put('tecnicos/' + this.idTecnico, tecnico).subscribe(
          data => {
            Swal.fire({ type: 'success', text: 'Accion Realizada!', timer: 2000 });
            this.getTecnicos();
          }
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
  public getStyle(style: string) {
    return style.toString();
  }
}