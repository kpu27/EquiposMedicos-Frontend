import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { Subject } from 'rxjs/Subject';
import { blockTransition } from '../../theme/utils/app-animation';
import { AppService } from 'src/app/services/app.service';
import { DatePipe } from '@angular/common';
import { FormioAppConfig } from 'angular-formio';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
class Actividad{constructor(public id: number, public nombre: string, public realizado: boolean){}};
const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false,
})
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  black: {
    primary: '#333333',
    secondary: '#cccccc'
  },
  green: {
    primary: 'rgb(94, 185, 114)',
    secondary: 'rgb(9, 70, 22)'
  }
};
@Component({
  selector: 'app-schedule',
  templateUrl: './tecnicos.component.html',
  animations: [blockTransition],
  host: {
    '[@blockTransition]': ''
  },
  providers: [DatePipe, FormioAppConfig]
})
export class TecnicosComponent implements OnInit {
  imgLogo = '../../../assets/img/soluciones-logo.png';
  detalles: Array<any>;
  idDetalle: number;
  clientes: Array<any>;
  actividades: Array<Actividad>;
  acts: Array<any>;
  idCliente: number;
  codigoReporte: string;
  clienteSelected: any;
  equipoSelected: any;
  tecnicoSelected: any;
  ordenSelected: any;
  form = false;
  view: string = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();
  settings: Settings;
  datos: FormGroup;
  datoschanged: boolean = true;
  allowed: boolean;
  detalleSelected: any;
  usuario : any;
  roles: string;
  es: any;
  tecnico: any;
  actions: CalendarEventAction[] = [{
    label: '<i class="material-icons icon-sm text-primary">visibility</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => { this.detalleSelected = this.detalles[event.id], this.openScheduleDialog(), this.settings.sidenavUserBlock = true }
  },
  {
    label: '<i class="material-icons icon-sm text-warning">list_alt</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => { this.verReporte(parseInt(String(event.id)))  }
  }];
  actions2: CalendarEventAction[] = [{
    label: '<i class="material-icons icon-sm text-primary">visibility</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => { this.detalleSelected = this.detalles[event.id], this.openScheduleDialog(), this.settings.sidenavUserBlock = true }
  }];
  events: CalendarEvent[] = [];
  info = {
    idDetalle: 0,
    responsable: '',
    equipo: '',
  }
  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    private _AppService: AppService,
    private datePipe: DatePipe,
    public config: FormioAppConfig,
    private _formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private auth: AuthService) {
    this.settings = this.appSettings.settings;
    this.detalles = [];
    this.actividades = [];
    this.idCliente = null;
    this.datos = this._formBuilder.group({
      descripcion: ['', Validators.compose([Validators.required, Validators.minLength(15), Validators.maxLength(80)])]
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
  ngOnInit() {
    this.usuario = this.auth.getDataUsuario();
    this.roles = this.usuario.roles[0];
    this.getClientes();
    this.getTecnico();
  }
  getTecnico(){
    this._AppService.get('tecnicos/responsable/'+this.usuario.id).subscribe(
      (data: any) => {this.tecnicoSelected = data}
    );
  }
  getDetalles(){
    if(this.roles == 'ROLE_ADMIN'){
      this.getCotizacionesDetallesByIdCliente();
    }else{
      this.getCotizacionesDetalles();
    }
  }
  getCotizacionesDetallesByIdCliente() {
    this.settings.loadingSpinner = true;
    this._AppService.get('ordenesDetalle/cliente/'+this.idCliente).subscribe(
      (data: any) => { this.detalles = data, this.setDates(); this.settings.loadingSpinner = false; },
      error => { this.settings.loadingSpinner = false; }
    );
  }
  getCotizacionesDetalles() {
    this.settings.loadingSpinner = true;
    this._AppService.get('ordenesDetalle/res/'+ this.tecnico.idTecnico +'/'+ this.idCliente).subscribe(
      (data: any) => { this.detalles = data, this.setDates(); this.settings.loadingSpinner = false; },
      error => { this.settings.loadingSpinner = false; }
    );
  }
  getClientes() {
    this._AppService.get('clientes/list').subscribe(
      (data: any) => {
        this.clientes = data;
      }
    );
  }
  setDates() {
    this.events = [];
    for (let index = 0; index < this.detalles.length; index++) {
      let item = this.detalles[index];
      let fecha = new Date(this.datePipe.transform(item.fechaProgramada, 'yyyy-MM-dd'));
      this.info.idDetalle = index;
      this.info.equipo = item.fkEquipos.nombre;
      //this.info.responsable = item.fkResponsable.nombre;
      this.idDetalle = item.idOrdenesDetalle;
      this.events.push({
        id: index,
        start: new Date(fecha),
        title: item.fkEquipos.nombre,
        color: this.setColors(item.estadoReporte),
        actions: this.setActions(item.estadoReporte),
      }
      );
    }
    this.refresh.next();
  }
  setActions(estado: number): CalendarEventAction[] {
    return this.actions
/*     switch (estado) {
      case 0:
        if(this.roles == 'ROLE_ADMIN'){ return this.actions2 }else{ return this.actions }
      case 1:
        return this.actions2
      default:
        break;
    } */
  }
  setColors(estado: number): any {
    switch (estado) {
      case 0:
        return colors.black
      case 1:
        return colors.green
      default:
        break;
    }
  }
  getActividadesProtocolo(idDetalle: number) {
    let idPro = this.detalles[idDetalle].fkEquipos.fkProtocolo.idProtocolo;
    console.log(idPro);
    this._AppService.get('actividades/protocolo/' + idPro).subscribe(
      (data: any) => { console.log(data); this.setActividades(data); this.acts = data; this.form = true },
      error => { console.log(error) }
    );
  }
  setActividades(data: any){
    this.actividades = [];
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      this.actividades.push(new Actividad(item.idActividades, item.actividades, false)); 
    }
  }
  validarActividades(): boolean{
    for (let index = 0; index < this.actividades.length; index++) {
      let item = this.actividades[index];
      if(item.realizado == true){
        this.allowed = true;
      }else{
        this.allowed = false;
      }
    }
    return this.allowed;
  }
  getDataDetalle(idDetalle: number) {
    this.clienteSelected = this.detalles[idDetalle].fkCliente;
    this.equipoSelected = this.detalles[idDetalle].fkEquipos;
    this.tecnicoSelected = this.tecnico;
    this.ordenSelected = this.detalles[idDetalle].fkOrdenes.idOrdenes;
  }
  dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  openScheduleDialog() {
    let dialogRef = this.dialog.open(ScheduleDialogComponent, {
      data: this.detalleSelected,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!result.isEdit) {
          result.color = colors.blue;
          result.actions = this.actions;
          this.events.push(result);
          this.refresh.next();
        } else {
          //implement edit here
        }
      }
    });
  }
  verReporte(idDetalle){
    swalWithBootstrapButtons.fire({
      text: 'Quiere ver el Reporte?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.getActividadesProtocolo(idDetalle);
        this.getDataDetalle(idDetalle);
        this.getConsecutivoReporte(this.usuario.empresa.idEmpresa);
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    })
  }
  getConsecutivoReporte(idEmpresa){
    let count: number;
    this._AppService.get('ordenesDetalle/reportes/count/'+idEmpresa).subscribe(
      (data: any) => {
        console.log(data);
        count = data;
        this._AppService.get('parametro/filtro_empresa_grupo_parametro/'+idEmpresa+'/0/153').subscribe(
          (data: any) => {
            console.log(data);
            this.codigoReporte = String(data[0].nombreCorto+data[0].valor+count); 
          }
        );
      }
    );
  }
  generarReporte(){
    if(this.datos.valid){
      if(this.validarActividades() == true){
        swalWithBootstrapButtons.fire({
          text: 'Seguro de que quiere generar el reporte?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si',
          cancelButtonText: 'No!',
          reverseButtons: true
        }).then((result) => {
          if (result.value) {
              this.settings.loadingSpinner = true;
              let datos = this.datos.value;
              let reporte = {
                descripcion: datos.descripcion,
                cliente: this.clienteSelected.idCliente,
                equipo: this.equipoSelected.idEquipos,
                responsable: this.tecnicoSelected.idTecnico,
                orden:  this.ordenSelected,
                codigoReporte: this.codigoReporte
              }
              let info = {
                codReport: String(this.codigoReporte),
                estado: 1,
                idDetalle: this.idDetalle,
                informacionReporte: String(JSON.stringify(reporte))
              }
              this._AppService.put('ordenesDetalle/reporte', info).subscribe(
                (data: any) => { this.settings.loadingSpinner = false;
                 this.datos.reset();
                 this.form = false;
                 this.getDetalles();
                 console.log(data)
                 Swal.fire({type: 'success', text: 'reporte generado', timer: 2000})
                },
                error => { this.settings.loadingSpinner = false;}
              );
          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
          }
        })
      }else{
        Swal.fire({ type: 'warning', text: 'debe validar las actividades', timer: 2000});
      }
    }
  }
  goBack(){
    this.form = false;
  }
}