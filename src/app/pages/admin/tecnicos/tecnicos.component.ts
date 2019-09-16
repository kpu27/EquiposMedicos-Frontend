import { Component, OnInit } from '@angular/core';
import { Slide } from 'src/app/services/constants';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.component.html',
  styleUrls: ['./tecnicos.component.scss'],
  animations: [Slide]
})
export class TecnicosComponent implements OnInit {
  public settings: Settings;
  constructor(public appSettings:AppSettings) { this.settings = this.appSettings.settings;}

  ngOnInit() {
    this.settings.tipoColor = 4;
  }

}
