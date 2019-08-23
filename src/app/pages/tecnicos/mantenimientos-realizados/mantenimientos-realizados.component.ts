import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import { DatePipe } from '@angular/common';
class Actividad{constructor(public id: number, public nombre: string, public realizado: boolean){}};
@Component({
  selector: 'app-mantenimientos-realizados',
  templateUrl: './mantenimientos-realizados.component.html',
  styleUrls: ['./mantenimientos-realizados.component.scss'],
  providers: [DatePipe]
})
export class MantenimientosRealizadosComponent implements OnInit {
  imgLogo = '../../../../assets/img/soluciones-logo.jpg';
  settings: Settings;
  usuario: any;
  reportesOrdenes: Array<any> = [];
  responsable: Array<any> = [];
  actividades: Array<Actividad> = [];
  clienteSelected: any;
  equipoSelected: any;
  tecnicoSelected: any;
  cols: any[];
  view = true;
  infoReporte: any;
  codigoReporte: any;
  constructor(
    public appSettings: AppSettings,    
    private _AppService: AppService,
    private datePipe: DatePipe,) { 
      this.settings = this.appSettings.settings;
      this.cols = [
        { field: 'idOrdenesDetalle', header: 'ID', width: '10%' },
        { field: 'fechaProgramada', header: 'Programada',width: '15%' },
        { field: 'fechaRealizada', header: 'Realizada',width: '15%' },
        { field: 'fkCliente', header: 'Cliente',width: '20%' },
        { field: 'fkOrdenes', header: '# Orden',width: '10%' },
        { field: 'estadoReporte', header: 'Estado',width: '10%' },
        { field: 'numeroReporte', header: '# Reporte',width: '10%' },
        { field: '', header: 'Acciones',width: '10%' }
    ];
    this.settings.tipoColor = 1;
    }

  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.getReportesOrdenes();
  }

  public getReportesOrdenes(){
    this.settings.loadingSpinner = true;
    this._AppService.get('ordenesDetalle/reportes/'+this.usuario.empresa.idEmpresa).subscribe(
      (data: any) => {this.reportesOrdenes = data; console.log(data); this.settings.loadingSpinner = false;}
    );
  }

  public setInfoReporte( data: any){
    this.infoReporte = JSON.parse(data.infomacionReporte);
    this.codigoReporte = data.numeroReporte;
    this.getResponsable(data.fkEquipos.idEquipos);
    this.getActividades(data.fkEquipos.fkProtocolo.idProtocolo);
    this.clienteSelected = data.fkCliente;
    this.equipoSelected = data.fkEquipos;
    this.view = false; 
  }

  public getResponsable(idEquipo){
    this._AppService.get('ordenesDetalle/responsable/').subscribe(
      (data: any) => {
        this.responsable = data; console.log(data);
      }
    );
  }

  public getActividades(idPro){
    let actividades: Array<any> = [];
    this._AppService.get('actividades/protocolo/'+idPro).subscribe(
      (data: any) => {
        actividades = data; 
        console.log(data);
        if(actividades.length > 0){this.setActividades(actividades);} 
      }
    );
  }

  public setActividades(data: any){
    this.actividades = [];
    for (let index = 0; index < data.length; index++) {
      let item = data[index];
      this.actividades.push(new Actividad(item.idActividades, item.actividades, true)); 
    }
  }
  
  public getStyle(style: string) {
    return style.toString();
  }
  public getDate(fecha: any) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }

}
