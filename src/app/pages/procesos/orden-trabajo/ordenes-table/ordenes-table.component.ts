import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import { DatePipe } from '@angular/common';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';

export interface DialogData {
  name: string;
}

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
  
  public cotizacion: any;
  constructor( 
    private datePipe: DatePipe,
    public appSettings:AppSettings, 
    private _AppService:AppService,
    public dialog: MatDialog 
    ) {  
      this.settings = this.appSettings.settings; 
      this.table = 0;
      this.cols = [
        { field: 'numOrden',header: '# Orden', width: '10%' },
        { field: 'fkCotizacion',header: '# Cotizacion', width: '10%' },
        { field: 'fkCotizacion',header: 'Cliente', width: '15%' },
        { field: 'fkCotizacion',header: 'Responsable', width: '10%' },
        { field: 'fechaOrden',header: 'Fecha', width: '10%' },
        { field: 'esatdoOrden',header: 'Estado', width: '6%' },
        { filed: 'acciones', header: 'Acciones', width: '8%'}
      ]; 
    }
  ngOnInit() {

  }

  getCotizacionById(id)
  {
    this.settings.loadingSpinner = true;
    this._AppService.get(`ordenes/${id}`).subscribe(
      (data:any) => {
        this.cotizacion = data;
        this.openDialog();
        this.settings.loadingSpinner = false;
      }
    )
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

  openDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '50em';
    dialogConfig.height = '35em';
    dialogConfig.data = this.cotizacion;

/*     dialogConfig.data = {
      id: 1,
      title: 'Angular For Beginners'
    };

    dialogConfig.position = {
      'top': '0',
      left: '0'
    }; */

    this.dialog.open(OrderDialogComponent, dialogConfig);
  }

}
