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


export interface DialogData {
  name: string;
}

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
  public data: Array<any>;
  public info: any;
  public display: boolean = false;
  public cols: any[];
  SelectCotizacion:any;
  usuario:Usuario;

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
      { field: 'vigencia', header: 'Vigencia', width: '10%' },
      { field: 'entrega', header: 'Entrega', width: '10%' },
      { field: 'condicionPago', header: 'Condicion de Pago', width: '12%' },
      { field: 'responsable', header: 'Responsable', width: '15%' },
      { field: 'estado', header: 'Estado', width: '10%' }
    ];
  }
  ngOnInit() {
    this.usuario = this.service.obtenerDatosUser();
    this.getCotizaciones();
  }
  selectCotizacion(cotizacion:any){
    this.SelectCotizacion = cotizacion;
  }

  public getCotizaciones() {
    this.settings.loadingSpinner = true;
    this._AppService.get('cotizaciones/empresa/'+this.usuario.empresa.idEmpresa).subscribe(
      (data: any) => { 
        this.data = data; 
        this.settings.loadingSpinner = false; }
    ),
    aguadecoco =>{
      console.log(aguadecoco)
    }
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

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '80%';
    dialogConfig.height = '80%';
    dialogConfig.data = this.SelectCotizacion;

    this.dialog.open(DialogComponent, dialogConfig);
  }

}
