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
  @Input() data: any;
  public settings: Settings;
  public protocolos: any;
  @Output() crearOrden = new EventEmitter();
  constructor( public appSettings:AppSettings, private _AppService:AppService) {  this.settings = this.appSettings.settings }
  ngOnInit() {
  }
  CrearOrden(cotizaciones: any) {
    this.crearOrden.emit(cotizaciones);
  }
}
