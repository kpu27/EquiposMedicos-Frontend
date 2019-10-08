import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-cotizaciones-table',
  templateUrl: './cotizaciones-table.component.html',
  styleUrls: ['./cotizaciones-table.component.scss']
})
export class CotizacionesTableComponent implements OnInit {
  estado: any;
  cotizaciones: any;
  @Output() cotizacion: any;
  @Output() cotizacionDetalles: any = new Array();
  settings: Settings;

  @Output() crearOrden = new EventEmitter();
  constructor( public appSettings:AppSettings, private _AppService:AppService) {  this.settings = this.appSettings.settings }
  ngOnInit() {
    this.getCotizacionesSinOrdenDeTrabajo(2);
  }


  getCotizacionesSinOrdenDeTrabajo(estado:number)
  {
    this._AppService.get(`cotizaciones/listar-cotizaciones-sin-orden/${estado}`).subscribe(
      (data:any) => {
        console.log(data);
        this.cotizaciones = data;
      }
    )
  }

  crearOrdenDetalle(cotizacion) {
    this._AppService.get(`cotizacionDetalle/cotizacion/${cotizacion.idCotizEncab}`).subscribe(result => { 
      console.log('RESULTADO PENDIENTE',result);
      this.cotizacionDetalles = result;
       }
      );
  }

  CrearOrden(cotizaciones: any) {
    this.crearOrdenDetalle(cotizaciones);
    console.log('DATO IMPORTANTE COTIZACIONES NO = ',cotizaciones);
    this.cotizacion = cotizaciones;
    this.estado = 'agregarOrden';
    this.crearOrden.emit(cotizaciones);
  }


}
