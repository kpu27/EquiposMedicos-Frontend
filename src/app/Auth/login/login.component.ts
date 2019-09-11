import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import swal from 'sweetalert2';
import { AppService } from 'src/app/services/app.service';
import { Usuario, UsuarioLogin } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [  ]
})
export class LoginComponent implements OnInit {
  public datos: FormGroup;
  public settings: Settings;
  public usuario:any;
  public Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  constructor(
    public appSettings:AppSettings,  
    private _formBuilder: FormBuilder, 
    private servicio: AppService, 
    private authService: AuthService) { 
    this.settings = this.appSettings.settings; 
  }
  ngOnInit() {
    this.settings.loadingSpinner = false;
    this.datos = this._formBuilder.group({
      'usuario': ['', Validators.compose([Validators.required,])],
      'password': ['', Validators.compose([Validators.required])],
    });
  }
  login(){
    if(this.datos.valid){

        this.settings.loadingSpinner = true;
        this.servicio.login(new UsuarioLogin(this.datos.controls['usuario'].value, this.datos.controls['password'].value)).subscribe(
          result =>{
            console.log(result);
            this.settings.loadingSpinner = false;
            this.Toast.fire({type: 'success',title: `Bienvenido ${result.nombre}`}); 
            /* this.authService.guardarUsuario(result.access_token); */
            this.authService.setToken(result.access_token);
            this.usuario = this.authService.getDataUsuario();
            this.settings.img = this.usuario.foto;
            console.log(this.authService.getDataUsuario());
          },
            
            error => {
              this.settings.loadingSpinner = false;
              this.Toast.fire({type: 'error',title: 'Credenciales incorrectas'});
            }
          );
    }else{
      this.Toast.fire({type: 'error',title: 'Resvise los campos'});
      this.markFormGroupTouched(this.datos);
        } 
    }
  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
