import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-hoja-vida',
  templateUrl: './hoja-vida.component.html',
  styleUrls: ['./hoja-vida.component.scss'],
  providers: [DatePipe]
})
export class HojaVidaComponent implements OnInit {
  @Input() data: any;
  public settings: Settings;
  public protocolos: any;
  public table: number;
  public cols: any[];
  constructor(
    private datePipe: DatePipe,
    public appSettings: AppSettings,
    private _AppService: AppService) {
    this.settings = this.appSettings.settings;
  }
ngOnInit() {
}
  public return (){
  this.table = 0;
}
}
