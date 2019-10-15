import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from 'src/app/services/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.scss']
})
export class ClientesListComponent implements OnInit {
  public settings: Settings;
  public clientes: any;
  public cols: any[];
  public estado: boolean;
  public nuevoC: any;
  usuario:Usuario;
  public estadoCliente: number;
  public actualizar: any;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  public tipoForm: number;
  private idCliente: number;
  constructor(private _formBuilder: FormBuilder,
    public appSettings: AppSettings,
    private _AppService: AppService,
    private service: AuthService
  ) {
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'documento', header: 'Nit',width: '10%'},
      { field: 'nombre', header: 'Nombre o Entidad', width: '20%' },
      { field: 'telefonoCelular', header: 'Celular',width: '10%' },
      { field: 'direccion', header: 'Direccion',width: '10%' },
      { field: 'ciudad', header: 'Ciudad',width: '10%' },
      { field: 'email', header: 'Email',width: '15%' },
      { filed: 'estado', header: 'Estado',width: '10%' },
      { field: 'acciones', header: 'Acciones',width: '10%' },

    ];
    this.estado = true;
  }
  ngOnInit() {
    this.usuario = this.service.obtenerDatosUser();
    this.getCliente();
    this.datos = this._formBuilder.group({
      documento: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
      nombreCorto: ['', Validators.compose([Validators.required])],
      direccion: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      ciudad: ['', Validators.compose([Validators.required])],
      telefonoCelular: ['', Validators.compose([Validators.required])],
      telefonoFijo: ['', Validators.compose([Validators.required])],
      atencion: ['', Validators.compose([Validators.required])],
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
  public nuevoCliente() {
    let datos = this.datos.value;
    let cliente = {
      "documento": datos.documento,
      "nombre": datos.nombre,
      "nombreCorto": datos.nombrecorto,
      "direccion": datos.direccion,
      "email": datos.email,
      "ciudad": datos.ciudad,
      "telefonoFijo": datos.telefonoFijo,
      "telefonoCelular": datos.telefonoCelular,
      "atencion": datos.atencion,
      "estado": 0,
      "fkEmpresa":this.usuario.empresa.idEmpresa
    }
    this._AppService.post('clientes/new', cliente).subscribe(
      result => {
      alert('El cliente se agregado con exito'),
        this.estado = true
        this.getCliente();
        this.datos.reset();
      }
    )
  }
  public clear() {
    this.datos.reset();
  }
  public setCliente(cliente: any) {
    this.datos.patchValue({
      documento: cliente.documento,
      nombre: cliente.nombre,
      nombreCorto: cliente.nombrecorto,
      direccion: cliente.direccion,
      email: cliente.email,
      ciudad: cliente.ciudad,
      telefonoCelular: cliente.telefonoCelular,
      telefonoFijo: cliente.telefonoFijo,
      atencion: cliente.atencion
    });
    this.idCliente = cliente.idCliente;
    this.estadoCliente = cliente.estado;
  }
  public editarDatos() {
    let datos = this.datos.value;
    let cliente = {
      "idCliente": this.idCliente,
      "documento": datos.documento,
      "nombre": datos.nombre,
      "nombreCorto": datos.nombrecorto,
      "direccion": datos.direccion,
      "email": datos.email,
      "ciudad": datos.ciudad,
      "telefonoFijo": datos.telefonoFijo,
      "telefonoCelular": datos.telefonoCelular,
      "atencion": datos.atencion,
      "estado": this.estadoCliente,
      "fkEmpresa":this.usuario.empresa.idEmpresa
    }
    this._AppService.put('cliente/' + this.idCliente, cliente).subscribe(
      result => {
        Swal.fire({ type: 'success', text: 'cliente actualizado con exito!', timer: 2000 });
        this.estado = true
        this.getCliente();
      }
    )
  }
  public getCliente() {
    this._AppService.get(`clientes/empresa/`+this.usuario.empresa.idEmpresa).subscribe(
      result => {
        this.clientes = result;
      },
      error => {
        console.log(error);
      });
  }
  public alerta(titulo: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: 'success',
      title: 'El registro a sido exitoso!'
    })
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
  public deleteCliente() {
    Swal.fire({
      title: 'Advertencia',
      text: 'Estas seguro de que quiere '+this.setText(this.estadoCliente)+' el Cliente?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        let datos = this.datos.value;
        let cliente = {
          "idCliente": this.idCliente,
          "documento": datos.documento,
          "nombre": datos.nombre,
          "nombreCorto": datos.nombrecorto,
          "direccion": datos.direccion,
          "email": datos.email,
          "ciudad": datos.ciudad,
          "telefonoFijo": datos.telefonoFijo,
          "telefonoCelular": datos.telefonoCelular,
          "atencion": datos.atencion,
          "estado": this.setEstdo(this.estadoCliente),
          "fkEmpresa":this.usuario.empresa.idEmpresa
        }
        this._AppService.put(`cliente/${this.idCliente}`, cliente).subscribe(
          data => {
            Swal.fire({ type: 'success', text: 'Accion Realizada', timer: 2000 });
            this.getCliente();
          },
          error => {
            console.log(error)
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'No se ha realizado ningun cambio',
          'error'
        )
      }
    })
  }
  public setTipoForm(tipo: number) {
    this.tipoForm = tipo;
  }
  public getStyle(style: string) {
    return style.toString();
  }
}