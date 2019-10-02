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
  public cotizaciones: any;
  public settings: Settings;
  public protocolos: any;
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
        this.cotizaciones = data
      }
    )
  }
  CrearOrden(cotizaciones: any) {
    this.crearOrden.emit(cotizaciones);
  }
    // @Get protocolos por Instrumentos
    public getProtocolosPorInstrumento(id: string){
      this._AppService.get('ip/1/instrumento/2').subscribe(
        result => {
          this.protocolos = result;
          if(this.protocolos.length > 0){}
        },
        error =>{
          console.log(error);
        });
    } 
}
