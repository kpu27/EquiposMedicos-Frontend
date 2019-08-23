import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { Settings } from '../../../../app.settings.model';
import { AppSettings } from '../../../../app.settings';
@Component({
  selector: 'app-cotizaciones-list',
  templateUrl: './cotizaciones-list.component.html',
  styleUrls: ['./cotizaciones-list.component.scss'],

  providers: [DatePipe]
})
export class CotizacionesListComponent implements OnInit {
  @Output() setidcot = new EventEmitter();
  @Input()
  set recargar(val: any) {
    if (val != undefined && val != null && val > 0) {
      this.getCotizaciones();
    }
    val = null;
  }
  public settings: Settings;
  public data:Array<any>;
  public info: any;
  public display: boolean = false;
  public cols: any[];
  constructor(
    public appSettings:AppSettings,
    private _AppService: AppService,
    public ngxSmartModalService: NgxSmartModalService) { 
      this.settings = this.appSettings.settings;
      this.cols = [
        { field: 'codigo', header: 'Codigo', width: '10%' },
        { field: 'fkEmpresa', header: 'Empresa',width: '20%' },
        { field: 'fkCliente', header: 'Cliente',width: '20%' },
        { field: 'vigencia', header: 'Vigencia',width: '10%' },
        { field: 'entrega', header: 'Entrega',width: '10%' },
        { field: 'condicionPago', header: 'Condicion de Pago',width: '10%' },
        { field: 'responsable', header: 'Responsable',width: '10%' },
        { field: 'estado', header: 'Estado',width: '10%' }
    ];
    }
  ngOnInit() {
    this.getCotizaciones();
  }
  public getCotizaciones(){
    this.settings.loadingSpinner = true;
    this._AppService.get('cotizaciones/list').subscribe(
      (data:any) => {console.log(data); this.data = data; this.settings.loadingSpinner = false;}
    );
  }
  public openForm() {
    this.setidcot.emit(this.data.length);
  }
  public getImg(imgNombre: string): string{
    return '../../../../../assets/img/'+imgNombre;
  }
  public getStyle(style: string) {
    return style.toString();
  }
}
