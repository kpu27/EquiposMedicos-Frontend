import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { Settings } from '../../../../app.settings.model';
import { AppSettings } from '../../../../app.settings';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/services/usuario';
import { Dialog2Component } from '../dialog2/dialog2.component';



@Component({
  selector: 'app-cotizaciones-por-aprovar',
  templateUrl: './cotizaciones-por-aprovar.component.html',
  styleUrls: ['./cotizaciones-por-aprovar.component.scss']
})
export class CotizacionesPorAprovarComponent implements OnInit {
  @Output() setidcot = new EventEmitter();
  @Input()
  set recargar(val: any) {
    if (val != undefined && val != null && val > 0) {
      this.getCotizaciones();
    }
    val = null;
  }
  public settings: Settings;
  public data: Array<any>;
  public info: any;
  public display: boolean = false;
  public cols: any[];
  SelectCotizacion:any;
  usuario:Usuario;
  aut:any;

  name: string;

  constructor(
    public appSettings: AppSettings,
    private _AppService: AppService,
    public ngxSmartModalService: NgxSmartModalService,
    public dialog: MatDialog,
    private service: AuthService) {
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'ver', header: 'Ver', width: '5%' },
      { field: 'codigo', header: 'Codigo', width: '8%' },
      { field: 'fkCliente', header: 'Cliente', width: '20%' },
      { field: 'vigencia', header: 'Vigencia', width: '8%' },
      { field: 'entrega', header: 'Entrega', width: '10%' },
      { field: 'condicionPago', header: 'Condicion de Pago', width: '12%' },
      { field: 'responsable', header: 'Responsable', width: '12%' },
      { field: 'estado', header: 'Estado', width: '10%' },
      { field: 'acciones', header: 'Accion', width: '5%' }
    ];
  }
  ngOnInit() {
    this.usuario = this.service.obtenerDatosUser();
    this.getCotizaciones();
  }

  public getCotizaciones() {
    this.settings.loadingSpinner = true;
    this._AppService.get('cotizaciones/estado/'+this.usuario.empresa.idEmpresa).subscribe(
      (data: any) => { console.log(data); 
        this.data = data; 
        this.settings.loadingSpinner = false; },
        error => { console.log(error),
          this.settings.loadingSpinner = false; }
    );
  }
  

  public openForm() {
    this.setidcot.emit(this.data.length);
  }
  public getImg(imgNombre: string): string {
    return '../../../../../assets/img/' + imgNombre;
  }
  public getStyle(style: string) {
    return style.toString();
  }

  selectCotizacion(cotizacion:any){
    this.SelectCotizacion = cotizacion;
  }
  
  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    this.dialog.open(DialogComponent, dialogConfig);
  }

  openDialog2() { 
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '30%';
    dialogConfig.height = '80%';
    dialogConfig.data = this.SelectCotizacion;

    this.dialog.open(Dialog2Component, dialogConfig);
  }


}
