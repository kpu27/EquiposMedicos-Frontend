import { Component, OnInit } from '@angular/core';
import { Settings } from '../../../app.settings.model';
import { AppSettings } from '../../../app.settings';
@Component({
  selector: 'app-orden-trabajo',
  templateUrl: './orden-trabajo.component.html',
  styleUrls: ['./orden-trabajo.component.scss']
})
export class OrdenTrabajoComponent implements OnInit {
  public settings: Settings;
  constructor(public appSettings:AppSettings) { this.settings = this.appSettings.settings}

  ngOnInit() {
    this.settings.tipoColor = 2;
  }

}
