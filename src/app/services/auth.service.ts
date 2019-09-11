import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  /* tslint:disable-next-line: variable-name */
  public _usuario: Usuario;
  /* tslint:disable-next-line: variable-name */
  public _token: string;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  public get usuario(): Usuario {
    if ( this._usuario !== null ) {
      return this._usuario;
    } else if ( this._usuario === null && sessionStorage.getItem('usuario') !== null) {
      this._usuario = this.auth.getDataUsuario() as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if ( this._token != null ) {
      return this._token;
    } else if ( this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
  }


  isTokenExpired(): boolean {
    let token = sessionStorage.getItem('token');
    let payload = this.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

  setToken(token:string) {
    sessionStorage.setItem('token', token);
    this.router.navigate(['/dashboard']); 
  }
  

  /* tslint:disable-next-line: variable-name */
  getDataUsuario() {
    // tslint:disable-next-line: prefer-const
    let token = sessionStorage.getItem('token');
    let payload = this.obtenerDatosToken(token);

    if(payload == null || payload == '' || payload == undefined) {
      this.router.navigate(['login']);
    }else {
      console.log(payload);
      this._usuario = new Usuario();
      this._usuario.id = payload.id;
      this._usuario.nombre = payload.nombre;
      this._usuario.apellido = payload.apellido;
      this._usuario.email = payload.email;
      this._usuario.empresa = payload.empresa;
      this._usuario.username = payload.user_name;
      this._usuario.foto = payload.foto;
      this._usuario.roles  = payload.authorities;
  /*     sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
      sessionStorage.setItem('empresa', JSON.stringify(payload.empresa)); */
  /*     this.router.navigate(['/dashboard']); */
      console.log(this._usuario);
      return this._usuario;
    }
  }


  /* tslint:disable-next-line: variable-name */
  obtenerDatosToken( access_token: string): any {
    // FIXME:
    if (access_token != null) {
      return JSON.parse(atob(access_token.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    // tslint:disable-next-line: prefer-const
    let token = sessionStorage.getItem('token');
    let payload = this.obtenerDatosToken(token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  hasRole(role: any): boolean {
    if (this.usuario != null && this.usuario.roles != null && this.usuario.roles.includes(role)) {
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

  obtenerDatosUser() {
    if ( this._usuario !== null ) {
      return this._usuario;
    } else if ( this._usuario === null && sessionStorage.getItem('usuario') !== null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }


}