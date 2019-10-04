import { APP } from './../../../services/constants';
import Swal from 'sweetalert2'
import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/services/app.service';
import { Settings } from 'src/app/app.settings.model';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
  empresas:any;
  empresa:any;
  myInputVariable: ElementRef;
  public settings: Settings;
  public clientes: any;
  public cols: any[];
  public estado: boolean;
  public nuevoC: any;
  public estadoCliente: number;
  public actualizar: any;
  public datos: FormGroup;
  public datoschanged: boolean = true;
  public tipoForm: number;
  private idCliente: number;
  UrlImages = APP.UrlImages;
  userImg;
  imagePath;
  imgURL: any;
  message: string;
  logoSeleccionado: File;
  constructor(private _formBuilder: FormBuilder,
    public appSettings: AppSettings,
    private _AppService: AppService,
    private appService: AppService,
    public ngxSmartModalService: NgxSmartModalService
  ) {
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'idEmpresa', header: 'id',width: '8%'},
      { field: 'nombreEmpresa', header: 'Nombre Empresa', width: '20%' },
      { field: 'nitEmpresa', header: 'NIT',width: '12%' },
      { field: 'representanteLegal', header: 'Representante Legal',width: '20%' },
      { filed: 'sloganEmpresa', header: 'Slogan',width: '30%' },
    ];
    this.estado = true;
  }
  ngOnInit() {
    this.getEmpresas();
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

  private getEmpresaById(id:number)
  {
    this.appService.get(`empresa/${id}`).subscribe(
      (data) => {
        this.empresa = data;
      },
      (error) => {
        console.log(error);
      }
    )
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
      "estado": 0
    }
    this._AppService.post('empresa/new', cliente).subscribe(
      result => {
      alert('El cliente se agregado con exito'),
        this.estado = true
        this.getEmpresas();
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
      "estado": this.estadoCliente
    }
    this._AppService.put('empresa/' + this.idCliente, cliente).subscribe(
      result => {
        Swal.fire({ type: 'success', text: 'empresa actualizada con exito!', timer: 2000 });
        this.estado = true
        this.getEmpresas();
      }
    )
  }
  public getEmpresas() {
    this._AppService.get(`empresa/list`).subscribe(
      result => {
        this.empresas = result;
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
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, salir'
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
          "estado": this.setEstdo(this.estadoCliente)
        }
        this._AppService.put(`cliente/${this.idCliente}`, cliente).subscribe(
          data => {
            Swal.fire({ type: 'success', text: 'Accion Realizada', timer: 2000 });
            this.getEmpresas();
          },
          error => {
            console.log(error)
          }
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
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

  // SUBIR LOGO IMAGEN 
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
    this.myInputVariable.nativeElement.value = "";
  
  }
  subirLogo() {
    if (!this.logoSeleccionado) {
      Swal.fire('Error de carga: ', 'Debe seleccionar una foto', 'error');
    } else if (this.empresa != null) {
      this.appService.subirImagen(this.logoSeleccionado, this.empresa.idEmpresa).subscribe(
        result => {
          //this.entidad = result;
          Swal.fire({ type: 'success', title: 'Exito!', text: `${result.mensaje}`, timer: 3000 });
          /*           this.regresar.emit(); */
          this.ngxSmartModalService.getModal('myModal').close();
          // this.getDataUser(this.usuario.id);
          this.getEmpresaById(this.empresa.idEmpresa);
        }
      );
    }
  }
  thisFileUpload() {
    document.getElementById("file").click();
  }


}
