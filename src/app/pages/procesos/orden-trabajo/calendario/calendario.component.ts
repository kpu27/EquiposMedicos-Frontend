import { id } from '@swimlane/ngx-charts/release/utils';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { CalendarioDialogComponent } from './calendario-dialog/calendario-dialog.component';
import { Subject } from 'rxjs/Subject';
import { blockTransition } from 'src/app/theme/utils/app-animation';
import { AppSettings } from 'src/app/app.settings';
import { Settings } from 'src/app/app.settings.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
export class OrdenDetalle {
  constructor(
    public tipoServicio: number,
    public calibracion: number,
    public fechaProgramada: string,
    public fechaRealizada: string,
    public numeroReporte: string,
    public infomacionReporte: string,
    public estadoReporte: number,
    public fkCliente: number,
    public fkEmpresa: number,
    public fkEquipos: any,
    public fkOrdenes: number,
    public fkResponsable:number
  ) { }
}
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
  }
};
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  animations: [blockTransition],
  styleUrls: ['./calendario.component.scss'],
  providers: [DatePipe],
  host: {
    '[@blockTransition]': ''
  }
})
export class CalendarioComponent implements OnInit {
  public form: FormGroup;
  public form2: FormGroup;
  public indexes: Array<any> = [];
  es: any;
  @Output() return = new EventEmitter();
  @Input() cotizacion: any;
  @Input() cotizacionDetalles: Array<any> = [];
  cotizacionDetallesSeleccionados: any = new Array();
  ordenDetalle: Array<any> = [];
  public tecnico; any;
  public tecnicos: any = [];
  public date;
  error_instrumento_lengh: any = { type: 'error', title: 'No ha seleccionado ningún instrumento' };
  error_form: any = { type: 'error', title: 'Revise el formulario' };
  public Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  events: CalendarEvent[] = new Array();
  view: string = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  actions: CalendarEventAction[] = [{
    label: '<i class="material-icons icon-sm white">remove_red_eye</i>',
    onClick: ({ event }: { event: CalendarEvent }): void => {
      this.openScheduleDialog(event);
    }
  }];
  refresh: Subject<any> = new Subject();
  public settings: Settings;
  public valid = false;
  public usuario: Usuario;
  public consecutivo: string;
  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public snackBar: MatSnackBar,
    public formBuilder: FormBuilder,
    private service: AppService,
    private auth: AuthService) {
    this.settings = this.appSettings.settings;
    this.form = this.formBuilder.group({
      'responsable': ['', Validators.compose([Validators.required])],
      'fecha': ['', Validators.compose([Validators.required])]
    });
    this.form2 = this.formBuilder.group({
      'comentarios': ['', Validators.compose([Validators.required])]
    });
  }
  ngOnInit() {
    this.usuario = this.auth.getDataUsuario();
    console.log(this.usuario);
    this.getTecnicos();
   
    this.getConsecutivo();
  }
  public crearOrden(){
    this.getConsecutivo();
    let idOrden: number;
    let valid = false;
    this.service.post('ordenes/new',this.setOrden()).subscribe(
      (data: any) => { console.log(data); idOrden = data.idOrdenes;
        for (let i = 0; i < this.ordenDetalle.length; i++) {
          this.ordenDetalle[i].fkOrdenes = idOrden;
          this.crearOrdenesDetalles(this.ordenDetalle[i], data.idOrdenes);
        }
          Swal.fire({type: 'success', text: 'Orden de Trabajo Creada con exito!', timer: 3000});
          this.setEstadoCotizacion();
          this.return.emit();
          const json = {
            "idCotizEncab": this.cotizacion.idCotizEncab,
            "fechaSistema": this.cotizacion.fechaSistema,
            "codigo": this.cotizacion.codigo,
            "fecha": this.cotizacion.fecha,
            "viaticoValor": this.cotizacion.viaticoValor,
            "viaticoIva": this.cotizacion.viaticoIva,
            "vigencia": this.cotizacion.vigencia,
            "entrega": this.cotizacion.entrega,
            "garantiaDf": this.cotizacion.garantiaDf,
            "garantiaMo": this.cotizacion.garantiaMo,
            "condicionPago": this.cotizacion.condicionPago,
            "responsable": this.cotizacion.responsable,
            "estado": 3,
            "fkCliente": this.cotizacion.fkCliente.idCliente,
            "fkEmpresa": this.cotizacion.fkEmpresa.idEmpresa
        }
        console.log("COTIZACION ====> ",json)
          this.service.put(`cotizaciones/${this.cotizacion.idCotizEncab}`, json).subscribe(
            (data:any) => {
              console.log(data);
            }
          )
      }
    );
  }
  public crearOrdenesDetalles(detalleOrden: any, idOrden: number){
    detalleOrden.fkOrdenes = idOrden;
    this.service.post('ordenesDetalle/new',detalleOrden).subscribe(
      (data: any) => {
        console.log(data)
      } 
    );
  }
   public setEstadoCotizacion(){
    this.cotizacion.estado = 3;
    this.service.put('cotizaciones/update',this.cotizacion).subscribe(
      (data: any) => {}
    );
  }
  public getTecnicos() {
    this.service.get('tecnicos/estado/'+this.usuario.empresa.idEmpresa).subscribe(
      data => {
        this.tecnicos = data;
        console.log(data);
      },
      error => {
        console.log(error);
      }
    );
  }
  public getConsecutivo(){
    let numOrdenes
    let idEmpresa = this.usuario.empresa.idEmpresa
    this.service.get('ordenes/count').subscribe(
      (data: any) => { numOrdenes = data;console.log('DATA ->',data)
      this.service.get('parametro/filtro_empresa_grupo_parametro/'+idEmpresa+'/0/163').subscribe(
        (data: any) => { console.log('dataa 2 ->',data);this.setConsecutivo(data[0].nombreCorto+data[0].valor+numOrdenes)}
     );
    }
      
    );

  }

  public setConsecutivo(consecutivo: any){
    console.log('Consecutivo ',consecutivo);
     this.consecutivo = String(consecutivo); 
  }
  public setOrden(){
    let fecha = new Date();
    let datos = this.form2.value;
    return {
      fkCotizacion: this.cotizacion.idCotizEncab,
      fkEmpresa: this.cotizacion.fkEmpresa.idEmpresa,
      numOrden: this.consecutivo,
      fechaOrden: fecha,
      herramientas: '',
      gafasSeguridad: 1,
      guantesDesechables: 1,
      tapaBocas: 1,
      gorro: 1,
      bata:1,
      riesgos: "sin riegos",
      comentarios: datos.comentario,
      esatdoOrden: 3
    }
  }
  public agregarMantenimiento() {
    if (this.cotizacionDetallesSeleccionados.length > 0) {
      if (this.form.valid) {
        var co = this.cotizacionDetallesSeleccionados;
        var f = this.cotizacionDetallesSeleccionados.length - 1;
        let limit = this.cotizacionDetalles.length;
        let title = '';
        if (co.length == 1) { title = 'Mantenimiento del equipo ' + co[0].fkEquipos.nombre + '(' + co[0].fkEquipos.referencia + ')' }
        if (co.length > 1) { title = 'Mantenimiento de ' + co.length + ' Equipos, desde ' + co[0].fkEquipos.nombre + '(' + co[0].fkEquipos.referencia + ') hasta ' + co[f].fkEquipos.nombre + '(' + co[f].fkEquipos.referencia + ')' }

        let tecnico: any;
        let datos = this.form.value;
        for (let i = 0; i < this.tecnicos.length; i++) {
          if (this.tecnicos[i].idTecnico === parseInt(datos.responsable)) {
            tecnico = this.tecnicos[i];
          }
        }
        let coDetalles: Array<any>  = this.cotizacionDetallesSeleccionados;

        for (let index = 0; index < this.indexes.length; index++) {
          this.cotizacionDetalles.splice(this.indexes[index], 1);
        }

        this.indexes = [];

        this.cotizacionDetallesSeleccionados = [];
        this.form.controls['responsable'].setValue(' ');
        this.form.controls['fecha'].setValue(' ');
        let fecha = this.datePipe.transform(datos.fecha, 'yyyy-MM-dd')
        let data = {
          start: new Date(datos.fecha),
          title: title,
          tecnico: tecnico,
          CoDetalle: coDetalles,
          color: colors.yellow,
          actions: this.actions
        }
        
        for (let i = 0; i < coDetalles.length; i++) {
          this.ordenDetalle.push({
            tipoServicio: 157,
            calibracion: 1,
            fechaProgramada: fecha,
            numeroReporte: '1',
            infomacionReporte: '1',
            estadoReporte: 3,
            fkCliente: this.cotizacion.fkCliente.idCliente,
            fkEmpresa: this.cotizacion.fkEmpresa.idEmpresa,
            fkEquipos: coDetalles[i].fkEquipos,
            fkOrdenes: 0,
            fkResponsable: tecnico.idTecnico
          });
        }

        console.log(this.ordenDetalle);
        if(limit == this.ordenDetalle.length){
          this.valid = true;
        }

        this.events.push(data);
        this.refresh.next();
        this.snackBar.open('Mantenimiento agregado satisfactoriamente!', null, {
          duration: 2500
        });

      } else {
        this.Toast.fire(this.error_form);
      }
    } else {
      this.Toast.fire(this.error_instrumento_lengh);
    }
  }
  isChecked(event: any, CoDetalle: any, index: number) {
    switch (event.checked) {
      case true:
        this.cotizacionDetallesSeleccionados.push(CoDetalle);
        this.indexes.push(index);
        console.log(this.cotizacionDetallesSeleccionados);
        break;
      case false:
        for (let i = 0; i < this.cotizacionDetallesSeleccionados.length; i++) {
          if (this.cotizacionDetallesSeleccionados[i].idCotizDeta === CoDetalle.idCotizDeta) { 
            this.cotizacionDetallesSeleccionados.splice(i, 1);
            this.indexes.splice(index, 1);
          }
        }
        break;
    }
  }
  dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
    console.log(date);
    console.log(events);
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  openScheduleDialog(event) {
    let dialogRef = this.dialog.open(CalendarioDialogComponent, {
      data: event
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
}