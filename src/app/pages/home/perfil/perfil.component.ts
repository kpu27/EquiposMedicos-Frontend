
import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import Swal from 'sweetalert2';
import { APP } from 'src/app/services/constants';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  @ViewChild('file')
  myInputVariable: ElementRef;
  idUser: any;
  usuario: any;
  usuario2: any;
  UrlImages = APP.UrlImages;
  userImg;
  imagePath;
  imgURL: any;
  message: string;
  logoSeleccionado: File;
  public settings: Settings;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  constructor(private _formBuilder: FormBuilder, public appSettings: AppSettings, private appService: AppService, private auth: AuthService, public ngxSmartModalService: NgxSmartModalService) {
    this.settings = this.appSettings.settings;
    this.usuario = this.auth.getDataUsuario();
    console.log(this.usuario.id);
    this.datos = this._formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
      apellido: ['', Validators.compose([Validators.required])],
      empresa: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      documento: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])]
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
  ngOnInit() {
    this.idUser = this.usuario.id;
    this.getDataUser(this.idUser);
  }
  setDataUser() {
    let datos = this.datos.value;
    return {
      apellido: datos.apellido,
      documento: datos.documento,
      email: datos.email,
      enabled: this.usuario2.enabled,
      expirado: this.usuario2.expirado,
      fkEmpresa: this.usuario2.fkEmpresa,
      foto: this.usuario2.foto,
      id: this.usuario2.id,
      nombre: datos.nombre,
      password: this.usuario2.password,
      roles: this.usuario2.roles,
      username: datos.username,
    }
  }
  updateUsuario() {
    Swal.fire({
      title: 'Advertencia',
      text: 'Estas seguro de que quiere actualizar la Informacion?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.settings.loadingSpinner = true;
        this.appService.put('usuarios/'+ this.usuario2.id, this.setDataUser()).subscribe(
          (data: any) => {
            this.getDataUser(this.idUser);
            this.settings.loadingSpinner = false;
            Swal.fire({
              type: 'success', text: 'La Informacion Ha sido Actualizada', timer: 2000
            });
          },
          error => {
            this.settings.loadingSpinner = false;
            Swal.fire({
              type: 'error', text: 'Error al Actualizar', timer: 2000
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }
  getDataUser(id: any) {
    this.settings.loadingSpinner = true;
    this.appService.get(`usuarios/${id}`).subscribe(
      result => {
        this.userImg = result['foto'];
        this.usuario2 = result;
        this.setForm(result);
        this.settings.img = result['foto'];
        this.settings.loadingSpinner = false;
      }
    );
  }
  setForm(data: any) {
    this.datos.patchValue({
      nombre: data.nombre,
      apellido: data.apellido,
      empresa: data.fkEmpresa.nombreEmpresa,
      username: data.username,
      documento: data.documento,
      email: data.email
    });
  }
  verLogo(files: any) {
    if (files.length === 0) {
      // this.imgURL = './assets/img/image_placeholder.jpg';
      return;
    }
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Solo imágenes son suportadas.';
      return;
    }
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }
  seleccionarLogo(event) {

    if (event.target.files[0] != 0 && event.target.files[0] != undefined) {
      this.logoSeleccionado = event.target.files[0];
      this.ngxSmartModalService.getModal('myModal').open();
    }
  }
  clearImage() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }
  subirLogo() {
    if (!this.logoSeleccionado) {
      Swal.fire('Error de carga: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.appService.subirImagen(this.logoSeleccionado, this.usuario.id).subscribe(
        result => {
          //this.entidad = result;
          Swal.fire({ type: 'success', title: 'Exito!', text: `${result.mensaje}`, timer: 3000 });
          /*           this.regresar.emit(); */
          this.ngxSmartModalService.getModal('myModal').close();
          // this.getDataUser(this.usuario.id);
          this.getDataUser(this.idUser);
        }
      );
    }
  }
  thisFileUpload() {
    document.getElementById("file").click();
  }
}
