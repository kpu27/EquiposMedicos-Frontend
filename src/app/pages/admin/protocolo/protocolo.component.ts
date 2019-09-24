import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Slide } from '../../../services/constants';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
@Component({
  selector: 'app-protocolo',
  templateUrl: './protocolo.component.html',
  styleUrls: ['./protocolo.component.scss'],
  animations: [Slide]
})
export class ProtocoloComponent implements OnInit {
  public data: any;
  public settings: Settings;
  constructor(private _AppService: AppService, public appSettings:AppSettings, ) { this.settings = this.appSettings.settings;}
  ngOnInit() {
    this.settings.tipoColor = 2;
  }
}
