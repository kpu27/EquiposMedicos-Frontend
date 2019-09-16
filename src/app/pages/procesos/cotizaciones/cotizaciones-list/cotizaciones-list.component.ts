import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { Settings } from '../../../../app.settings.model';
import { AppSettings } from '../../../../app.settings';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

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

  name: string;

  constructor(
    public appSettings: AppSettings,
    private _AppService: AppService,
    public ngxSmartModalService: NgxSmartModalService,
    public dialog: MatDialog) {
    this.settings = this.appSettings.settings;
    this.cols = [
      { field: 'ver', header: 'Ver', width: '5%' },
      { field: 'codigo', header: 'Codigo', width: '8%' },
      { field: 'fkCliente', header: 'Cliente', width: '20%' },
      { field: 'vigencia', header: 'Vigencia', width: '5%' },
      { field: 'entrega', header: 'Entrega', width: '10%' },
      { field: 'condicionPago', header: 'Condicion de Pago', width: '12%' },
      { field: 'responsable', header: 'Responsable', width: '15%' },
      { field: 'estado', header: 'Estado', width: '10%' },
      { field: 'acciones', header: 'Acciones', width: '10%' }
    ];
  }
  ngOnInit() {
    this.getCotizaciones();
  }

  public getCotizaciones() {
    this.settings.loadingSpinner = true;
    this._AppService.get('cotizaciones/list').subscribe(
      (data: any) => { console.log(data); this.data = data; this.settings.loadingSpinner = false; }
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

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;

/*     dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners'
    };
 */
/*     dialogConfig.position = {
      'top': '0',
      left: '0'
    }; */

    this.dialog.open(DialogComponent, dialogConfig);
  }

}
