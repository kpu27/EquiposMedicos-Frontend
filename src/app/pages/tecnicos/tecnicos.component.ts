import { Component, OnInit, Input } from '@angular/core';
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
import { APP } from '../../services/constants';
import { InventarioFormComponent } from './inventario-form/inventario-form.component';
class Actividad { constructor(public id: number, public nombre: string, public realizado: boolean) { } }
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
  host: { '[@blockTransition]': '' },
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
  view = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen = true;
  refresh: Subject<any> = new Subject();
  settings: Settings;
  datos: FormGroup;
  datoschanged = true;
  allowed: boolean;
  detalleSelected: any;
  usuario: any;
  roles: string;
  es: any;
  public id_orden_detalle_report: number;
  public descripcion: any;
  public modelo: any;
  public marca: any;
  public serial = '';
  public serialValid = false;
  public calibracionvalid: any = 0;
  public calibracionallowed = false;
  public calibracion: any;
  tecnico: any;
  actions: CalendarEventAction[] = [{
    label: '<i class="material-icons icon-sm text-primary">visibility</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.detalleSelected = this.detalles[event.id],
        this.openScheduleDialog(),
        this.settings.sidenavUserBlock = true;
    }
  },
  {
    label: '<i class="material-icons icon-sm text-warning">list_alt</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.id_orden_detalle_report = parseInt(String(event.id));
      this.verReporte(parseInt(String(event.id)));
    }
  }];
  actions2: CalendarEventAction[] = [{
    label: '<i class="material-icons icon-sm text-primary">visibility</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.detalleSelected = this.detalles[event.id],
        this.openScheduleDialog(), this.settings.sidenavUserBlock = true;
    }
  },
  {
    label: '<i class="material-icons icon-sm text-danger">print</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.getReporteMantenimiento(this.detalles[event.id].idOrdenesDetalle);
    }
  }];
  events: CalendarEvent[] = [];
  info = {
    idDetalle: 0,
    responsable: '',
    equipo: '',
  };
  public infoReporte: Array<any> = [{ propiedad: '', valor: 0 }];

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
    this.acts = [];
    this.idCliente = null;
    this.datos = this._formBuilder.group({
      descripcion: ['', Validators.compose([Validators.required, Validators.minLength(15), Validators.maxLength(80)])]
    });
    this.datos.valueChanges.subscribe(() => {
      this.datoschanged = true;
      let times = 0;
      let veces = 0;
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
    this.usuario = this.auth.getDataUsuario();
    this.roles = this.usuario.roles[0];
    this.getClientes();
    this.getTecnico();
  }
  public addInfoReport() {
    this.infoReporte.push({ propiedad: '', valor: 0 });
  }

  getTecnico() {
    this._AppService.get('tecnicos/responsable/' + this.usuario.id).subscribe(
      (data: any) => { this.tecnicoSelected = data; }
    );
  }
  getDetalles() {
    if (this.roles === 'ROLE_ADMIN') {
      this.getCotizacionesDetallesByIdCliente();
    } else {
      this.getCotizacionesDetalles();
    }
  }
  getCotizacionesDetallesByIdCliente() {
    this.settings.loadingSpinner = true;
    this._AppService.get('ordenesDetalle/cliente/' + this.idCliente).subscribe(
      (data: any) => { this.detalles = data, this.setDates(); this.settings.loadingSpinner = false; },
      error => { this.settings.loadingSpinner = false; }
    );
  }
  getCotizacionesDetalles() {
    this.settings.loadingSpinner = true;
    this._AppService.get('ordenesDetalle/res/' + this.tecnicoSelected.idTecnico + '/' + this.idCliente).subscribe(
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
      const item = this.detalles[index];
      const fecha = new Date(this.datePipe.transform(item.fechaProgramada, 'M/d/yy'));
      fecha.setDate(fecha.getDate() + 1);
      this.info.idDetalle = index;
      this.info.equipo = item.fkEquipos.nombre;
      // this.info.responsable = item.fkResponsable.nombre;
      this.idDetalle = item.idOrdenesDetalle;
      this.events.push({
        id: index,
        start: fecha,
        title: item.fkEquipos.nombre,
        color: this.setColors(item.estadoReporte),
        actions: this.setActions(item.estadoReporte),
      }
      );
    }
    this.refresh.next();
  }
  setActions(estado: number): CalendarEventAction[] {
    // return this.actions
    switch (estado) {
      case 3:
        return this.actions;
      case 4:
        return this.actions2;
      default:
        break;
    }
  }
  setColors(estado: number): any {
    switch (estado) {
      case 3:
        return colors.blue;
      case 4:
        return colors.green;
      default:
        break;
    }
  }
  getActividadesProtocolo(idDetalle: number) {
    const idPro = this.detalles[idDetalle].fkEquipos.fkProtocolo.idProtocolo;
    this._AppService.get('actividades/protocolo/' + idPro).subscribe(
      (data: any) => {
        this.acts = data;
        this.setActividades(data);
        this.form = true;
      },
      error => { console.log(error); }
    );
  }
  setActividades(data: Array<any>) {
    this.actividades = [];
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      this.actividades.push(new Actividad(item.idActividades, item.actividades, false));
    }
    this.form = true;
  }
  validarActividades(): boolean {
    for (let index = 0; index < this.actividades.length; index++) {
      const item = this.actividades[index];
      if (item.realizado === true) {
        this.allowed = true;
      } else {
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
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
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
          // implement edit here
        }
      }
    });
  }
  public verReporte(idDetalle) {
    Swal.fire({
      text: 'Quiere ver el Reporte?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.serial = '';
        this.marca = '';
        this.modelo = '';
        this.serialValid = false;
        this.calibracionvalid = 0;
        this.calibracionallowed = false;
        this.calibracion = null;
        this.descripcion = null;
        this.getActividadesProtocolo(idDetalle);
        this.getDataDetalle(idDetalle);
        this.getConsecutivoReporte(this.usuario.empresa.idEmpresa);
        this.idDetalle = this.detalles[this.id_orden_detalle_report].idOrdenesDetalle;
        console.log('id detalle => ', this.idDetalle);
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
      }
    });
  }

  public goBack() {
    this.form = false;
  }

  public getInfo(data: any) {
    return String(data);
  }

  public getReporteMantenimiento(id) {
    this.settings.loadingSpinner = true;
    this._AppService.get('reporte/mantenimiento/' + id).subscribe((response: any) => {
      this.settings.loadingSpinner = false;
      const url = APP.url + 'reporte/view/' + response.ruta;
      console.log(url);
      window.open(url);
    },
      error => {
        this.settings.loadingSpinner = false;
      });
  }

  public findBySerial() {
    this._AppService.get('equiposInve/serial/' + this.serial + '/' + String(this.equipoSelected.idEquipos)).subscribe(
      (data: any) => {
        console.log(data);
        if (data != null) {
          this.marca = data.marca;
          this.modelo = data.modelo;
          this.serialValid = true;
          this._AppService.showSuccess('El serial ya existe');
        } else {
          Swal.fire({
            title: 'Advertencia',
            text: 'El Serial no Esta Registrado, Desea Registrarlo?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, Registrar',
            cancelButtonText: 'No, Cancelar',
          }).then((result) => {
            if (result.value) {
              this.openModalInventarioForm();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
          });
        }
      },
      error => { this._AppService.showError('Error al consultar el Serial'); }
    );
  }

  public openModalInventarioForm() {
    const dialogRef = this.dialog.open(InventarioFormComponent, {
      data: {
        serial: this.serial,
        empresa: this.usuario.empresa.idEmpresa,
        cliente: this.clienteSelected,
        equipo: this.equipoSelected,
      },
      width: '70%',
      height: 'auto',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.close === 1) {
        this.serial = result.serial;
        this.marca = result.marca;
        this.modelo = result.modelo;
        this.serialValid = true;
      }
    });
  }

  public getCalibracion(data: any) {
    if (data.valid === true) {
      console.log(data.calibracion);
      this._AppService.showSuccess('Calibracion validada');
      this.calibracion = data.calibracion;
      this.calibracionallowed = true;
      this.calibracionvalid = 0;
    } else {
      this._AppService.showWarning('los datos de la calibracion no estan validados');
      this.calibracionallowed = false;
      this.calibracionvalid = 0;
    }
  }

  public getConsecutivoReporte(idEmpresa: number) {
    let count: number;
    this._AppService.get('ordenesDetalle/reportes/count/' + idEmpresa).subscribe(
      (data: any) => {
        console.log(data);
        count = data;
        this._AppService.get('parametro/filtro_empresa_grupo_parametro/' + idEmpresa + '/0/153').subscribe(
          (data2: any) => {
            console.log(data);
            this.codigoReporte = String(data2[0].nombreCorto + data2[0].valor + count);
            console.log(this.codigoReporte);
          }
        );
      }
    );
  }

  public generarReporte() {
    this.calibracionvalid = 1;
    if (this.validarActividades() === true) {
      Swal.fire({
        text: 'Seguro de que quiere generar el reporte?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No!',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          if (this.calibracionallowed === true) {
            this.settings.loadingSpinner = true;
            const datos = this.datos.value;
            const reporte = {
              descripcion: this.descripcion,
              cliente: this.clienteSelected.idCliente,
              equipo: this.equipoSelected.idEquipos,
              orden: this.ordenSelected,
              codigoReporte: this.codigoReporte
            };
            const info = {
              serial: this.serial,
              fkModelo: this.modelo,
              fkMarca: this.marca,
              codReport: String(this.codigoReporte),
              estado: 4,
              idDetalle: this.idDetalle,
              informacionReporte: String(JSON.stringify(reporte)),
              calibracion: this.calibracion,
            };
            console.log(info);
            this._AppService.put('ordenesDetalle/reporte', info).subscribe(
              (data: any) => {
                console.log(data);
                this.settings.loadingSpinner = false;
                this.datos.reset();
                this.form = false;
                this.getDetalles();
                Swal.fire({ type: 'success', text: 'reporte generado', timer: 3000, showConfirmButton: false });
              },
              error => { this.settings.loadingSpinner = false; }
            );
          } else {
            Swal.fire({
              type: 'warning',
              text: 'los datos de la calibracion no son validos',
              showConfirmButton: false,
              timer: 3000,
            });
          }
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) { }
      });
    } else {
      Swal.fire({ type: 'warning', text: 'debe validar las actividades', timer: 2000 });
    }
  }
}
