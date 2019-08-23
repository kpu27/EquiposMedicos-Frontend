import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { Settings } from '../../../../app.settings.model';
import { AppSettings } from '../../../../app.settings';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { blockTransition } from '../../../../theme/utils/app-animation';
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
})
export class Equipo {
  constructor(
    public idEquipo: number,
    public nombreEquipo: string,
    public valoru: number,
    public cant: number,
    public calibracion: number
  ) { }
}
@Component({
  selector: 'app-cotizaciones-form',
  templateUrl: './cotizaciones-form.component.html',
  styleUrls: ['./cotizaciones-form.component.scss'],
  animations: [blockTransition],
  host: {
    '[@blockTransition]': ''
  },
  providers: [DatePipe]
})
export class CotizacionesFormComponent implements OnInit {
  @Output() return = new EventEmitter();
  @Input() idCot: number;
  public settings: Settings;
  public datos: FormGroup;
  public empresas: Array<any>;
  public clientes: Array<any>;
  public parametros: Array<any>;
  public equipos: Array<any>;
  public equiposSelected: Array<any>;
  public Cotizaciones: Array<any>;
  public consecutivo: Array<any>;
  public iva: Array<any>;
  public info: any;
  public fecha: any;
  public fechaentrega: any;
  public idEmpresa: number;
  public idCliente: number;
  public datoschanged: boolean = true;
  public panelOpenState = false;
  public alowed: boolean;
  public cols: any[];
  public usuario: any;
  constructor(
    public appSettings: AppSettings,
    private _AppService: AppService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService) {
    this.equipos = [];
    this.equiposSelected = [];
    this.consecutivo = [];
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'codigo', header: 'Codigo' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'accion', header: 'Agregar' }
    ];
  }
  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this._AppService.get('cotizacionDetalle/list').subscribe(data => { console.log(data) });
    this.getClientes();
    this.getEquipos();
    this.getIdEmpresa();
    this.getParametros();

    this.datos = this._formBuilder.group({
      idCliente: ['', Validators.compose([Validators.required])],
      cp: ['', Validators.compose([Validators.required])],
      viatico: ['', Validators.compose([Validators.required])],
      fecha: ['', Validators.compose([Validators.required])],
      iva: ['', Validators.compose([Validators.required])],
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
      console.log(this.datoschanged);
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
  public getIdEmpresa() {
    let empresa = JSON.parse(sessionStorage.getItem('empresa'));
    this.idEmpresa = empresa.idEmpresa;
  }
  public getClientes() {
    this._AppService.get('clientes/list').subscribe(
      (data: any) => {
        this.clientes = data;
      }
    );
  }
  public getEquipos() {
    this._AppService.get('equipos/list/activos').subscribe(
      (data: any) => {
        this.equipos = data;
      }
    );
  }
  public getParametros() {
    this._AppService.get('parametro/filtro_empresa_grupo/' + this.idEmpresa + '/13').subscribe(
      (data: any) => {
        this.parametros = data;
      }
    );
    this._AppService.get('parametro/filtro_empresa_parametro/' + this.idEmpresa + '/153').subscribe(
      (data: any) => {
        this.consecutivo = data;
      }
    );
    this._AppService.get('parametro/filtro_empresa_parametro/' + this.idEmpresa + '/162').subscribe(
      (data: any) => {
        this.iva = data;
      }
    );
  }
  public getDate() {
    this.fechaentrega = this.datePipe.transform(this.datos.value.fecha, 'yyyy-MM-dd');
  }
  public addEquipo(data: any, index: number) {
    this.equiposSelected.push(new Equipo(data.idEquipos, data.nombre, 0, 0, 0));
    this.equipos.splice(index, 1);
  }
  public agregarValorUnidad(index: number, event: any) {
    this.equiposSelected[index].valoru = event;
  }
  public agregarCantidad(index: number, event: any) {
    this.equiposSelected[index].cant = event
  }
  public agregarCalibracion(index: number, event: any) {
    this.equiposSelected[index].calibracion = event;
  }
  public goBack() {
    this.return.emit();
  }
  public CrearDetalle(
    calibracion: number,
    cantidad: number,
    idCot: number,
    idEqui: number,
    orden: number,
    valoru) {
    let detalles = {
      "idCotizDeta": 0,
      "calibracion": calibracion,
      "cantidad": cantidad,
      "estado": 0,
      "fkCotizEncab": idCot,
      "fkEquipos": idEqui,
      "orden": orden,
      "servicio": null,
      "tipoServicio": 0,
      "valorUnitario": valoru
    }
    this._AppService.post('cotizacionDetalle/new', detalles).subscribe(
      data => { console.log(data) }
    );
  }
  public validarInput():boolean {
    for (let index = 0; index < this.equiposSelected.length; index++) {
      const item:Equipo  = this.equiposSelected[index];
      if(item.valoru == 0 || item.cant == 0){
        this.alowed = false;
      }else{ this.alowed = true}
    }
    return this.alowed;
  }
  public submit() {
    if(this.validarInput() == true){
      swalWithBootstrapButtons.fire({
        text: 'Seguro de que quiere Crear la Catizacion?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
            this.settings.loadingSpinner = true;
            let datos = this.datos.value;
            let consecutivo = parseInt(this.consecutivo[0].codigo);
            consecutivo = consecutivo + this.idCot + 1;
            let contizacion = {
              "idCotizEncab": this.idCot + 1,
              "fechaSistema": "2019-01-01T00:00:00.000+0000",
              "codigo": String(this.consecutivo[0].nombreCorto + this.consecutivo[0].valor+ this.idCot),
              "fecha": this.datePipe.transform(datos.fecha, 'yyyy-MM-dd'),
              "viaticoValor": datos.viatico,
              "viaticoIva": datos.iva,
              "vigencia": "30",
              "entrega": this.fechaentrega,
              "garantiaDf": "0",
              "garantiaMo": "0",
              "condicionPago": datos.cp,
              "responsable": this.usuario.nombre,
              "estado": 0,
              "fkCliente": datos.idCliente,
              "fkEmpresa": this.idEmpresa
            }
            this._AppService.post('cotizaciones/new', contizacion).subscribe(
              (data: any) => {
                for (let index = 0; index < this.equiposSelected.length; index++) {
                  this.CrearDetalle(
                    this.equiposSelected[index].calibracion,
                    this.equiposSelected[index].cant,
                    this.idCot + 1,
                    this.equiposSelected[index].idEquipo,
                    this.idCot + 1, this.equiposSelected[index].valoru);
                }
                this.settings.loadingSpinner = false;
                Swal.fire({
                  type: 'success',
                  title: 'Grandioso',
                  text: 'Cotizacion Creada',
                  timer: 2500
                });
                this.goBack();
              }
            );
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          this.alowed = null;
        }
      })
    }else{
      Swal.fire({type: 'error', text: 'debe ingresar los valores', timer: 2000}) 
    }
  }
  public openModal(){
    this.ngxSmartModalService.getModal('myModal').open();
  }
  public closeModal(){
    this.ngxSmartModalService.getModal('myModal').close();
  }
}
