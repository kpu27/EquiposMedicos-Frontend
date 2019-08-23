import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/services/usuario';
import { APP } from 'src/app/services/constants';
import { AppService } from 'src/app/services/app.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  settings: Settings;
  public usuarios: Array<any> = [];
  public estado: any;
  public nUsuario: any;
  public usuario: any;
  public id: number;
  public vacio: any;
  public actualizar: any;
  public estadoUsuario: any;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  public view = true;
  public searchText: any;
  public imgUrl = APP.UrlImages;
  public imgUser:string;
  public estadoUser:boolean;
  public expiradoUser: number;
  public cols: any[];
  public roles: Array<any> = [];
  public userRol: Array<any> = [];
  public tipoForm: number;
  public empresaUser: number;
  constructor(
    public appSettings: AppSettings,
    public servivio: AppService,
    private _formBuilder: FormBuilder,
    public service: AuthService) {
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'IMG', header: 'Foto', width: '10%' },
      { field: 'id', header: 'ID', width: '5%' },
      { field: 'Usuario', header: 'username', width: '15%' },
      { field: 'nombre', header: 'Nombre', width: '15%' },
      { field: 'Apellido', header: 'apellido', width: '15%' },
      { field: 'Documento', header: 'documento', width: '10%' },
      { field: 'Email', header: 'email', width: '20%' },
      { field: '', header: 'Acciones', width: '10%' }
    ];
    this.settings.tipoColor = 1;
    this.estado = 'previa';
    this.roles = [{id: 2, nombre: "ROLE_ADMIN"},{"id": 3, "nombre": "ROLE_TECNICO"}]
  }
  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.listarUsuario();
    this.datos = this._formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      documento: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
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
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  fieldValidation(datos: FormGroup, name: any) {
    if (datos.get([name]).invalid && datos.get([name]).touched) {
      return true;
    }
  }
  clear() {
    this.datos.reset();
  }
  public listarUsuario() {
    this.servivio.get('usuarios/list').subscribe(
      (result: any) => {
        this.usuarios = result;
        console.log(this.usuarios);
      }
    )

  }
  public postUsuario() {
    let datos = this.datos.value;
    this.userRol.push(this.roles[1])
    let usuario = {
      "nombre": datos.nombre,
      "apellido": datos.apellido,
      "documento": datos.documento,
      "email": datos.email,
      "enabled": 1,
      "username": datos.username,
      "fkEmpresa": this.usuario.empresa.idEmpresa,
      "password": datos.password,
      "expirado": 1,
      "foto": "",
      "roles": [{id: 1, nombre: "ROLE_TECNICO"}]
    }
    console.log(usuario);
    this.servivio.post('usuarios/new', usuario).subscribe(
      result => {
        console.log(result);
        Swal.fire({
          type: 'success',
          text: 'Usuario Creado con Exito!',
          timer: 2000
        });
        this.clear()
        this.view = true;
        this.listarUsuario();
      },
      error => {
        console.log(error);
        this.userRol = [];
        Swal.fire({type: 'error', text: 'Error al Crear el Usuario', timer: 2000});
      }
    )
  }
  public setUsuario(user: any) {
    this.userRol = [];
    this.datos.patchValue({
      nombre: user.nombre,
      apellido: user.apellido,
      username: user.username,
      documento: user.documento,
      email: user.documento,
      password: user.password,
      rol: 0
    });
    this.id = user.id;
    this.imgUser = user.foto;
    this.estadoUser = user.enabled;
    this.expiradoUser = user.expirado;
    this.userRol = user.roles;
    this.empresaUser = user.fkEmpresa.idEmpresa
  }
  //ACTUALIZAR USUARIO
  public putUsuario() {
    let datos = this.datos.value;
    let usuario = {
      "id": this.id,
      "nombre": datos.nombre,
      "apellido": datos.apellido,
      "documento": datos.documento,
      "email": datos.email,
      "enabled": this.estadoUser,
      "username": datos.username,
      "fkEmpresa": this.empresaUser,
      "expirado": this.expiradoUser,
      "roles": this.userRol,
      "foto": this.imgUser,
      "password": datos.password
    }
    console.log(usuario);
    this.servivio.put('usuarios/' + this.id, usuario).subscribe(
      result => {
        console.log(result);
        Swal.fire({
          type: 'success',
          text: 'Usuario Actualizado con Exito!',
          timer: 2000
        });
        this.clear()
        this.view = true;
        this.listarUsuario();
      }, error => {
        console.log(error);
        this.userRol = [];
        Swal.fire({type: 'error', text: 'Error al Editar el Usuario', timer: 2000});
      }
    )
  }
  public getStyle(style: string) {
    return style.toString();
  }
  public setTipoForm(tipo){
    this.tipoForm = tipo;
  }
}
