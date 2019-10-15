import { Component, OnInit } from '@angular/core';
import { blockTransition } from '../../../theme/utils/app-animation';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss'],
  animations: [blockTransition],
  host: {
    '[@blockTransition]': ''
  }
})
export class CotizacionesComponent implements OnInit {
  public idcot: number;
  public showForm: boolean;
  public showList: boolean;
  public TableRec: any = 0;
  public settings: Settings;
  constructor(public appSettings:AppSettings) { this.showList = true; this.settings = this.appSettings.settings; }
  ngOnInit() {
    this.settings.tipoColor = 1;
  }
  openForm(data:number){
    this.idcot = data; 
    this.showList = false; 
    this.showForm = true
  }
  closeForm(){
    this.showForm = false;
    this.showList = true;
    this.recargarTable();
  }
  
  recargarTable() {
    this.TableRec = this.TableRec + 1;
  }
}
