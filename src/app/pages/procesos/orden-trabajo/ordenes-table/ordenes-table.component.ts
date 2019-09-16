import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ordenes-table',
  templateUrl: './ordenes-table.component.html',
  styleUrls: ['./ordenes-table.component.scss'],
  providers: [DatePipe]
})
export class OrdenesTableComponent implements OnInit {
  @Input() data: any;
  public settings: Settings;
  public protocolos: any;
  public table:number;
  public cols: any[];
  constructor( 
    private datePipe: DatePipe,
    public appSettings:AppSettings, 
    private _AppService:AppService) {  
      this.settings = this.appSettings.settings; 
      this.table = 0;
      this.cols = [
        { field: 'idOrdenes',header: 'Id', width: '5%' },
        { field: 'numOrden',header: '# Orden', width: '10%' },
        { field: 'fkCotizacion',header: '# Cotizacion', width: '10%' },
        { field: 'fkCotizacion',header: 'Cliente', width: '20%' },
        { field: 'fkCotizacion',header: 'Responsable', width: '10%' },
        { field: 'fechaOrden',header: 'Fecha', width: '10%' },
        { field: 'riesgos',header: 'Riesgo', width: '10%' },
        { field: 'esatdoOrden',header: 'Estado', width: '10%' },
        { filed: 'acciones', header: 'Acciones', width: '10%'}
      ]; 
    }
  ngOnInit() {
  }
  public return(){
    this.table = 0;
  }
  // @Get protocolos por Instrumentos
  public getProtocolosPorInstrumento(id: string){
    this._AppService.get('ip/1/instrumento/2').subscribe(
      result => {
        this.protocolos = result;
        if(this.protocolos.length > 0){this.table = 1;}
      },
      error =>{
        console.log(error);
      });
  } 
  public getDate(fecha: any) {
    return this.datePipe.transform(fecha, 'yyyy-MM-dd');
  }
  public getStyle(style: string) {
    return style.toString();
  }
}
