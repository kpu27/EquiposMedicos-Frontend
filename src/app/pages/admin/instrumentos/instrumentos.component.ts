import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import {Slide} from '../../../services/constants';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
@Component({
  selector: 'app-instrumentos',
  templateUrl: './instrumentos.component.html',
  styleUrls: ['./instrumentos.component.scss'],
  animations: [Slide]
})
export class InstrumentosComponent implements OnInit {
  public instrumentos: any;
  public settings: Settings;
  constructor(private _AppService: AppService, public appSettings:AppSettings ) {this.settings = this.appSettings.settings;  }

  ngOnInit() {
    this.settings.tipoColor = 3;
  }
}
