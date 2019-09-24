import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import {Slide} from '../../../services/constants';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  animations: [Slide]
})
export class ClientesComponent implements OnInit {
  public data: any;
  public settings: Settings;
  constructor(private _AppService: AppService, public appSettings:AppSettings) {this.settings = this.appSettings.settings }

  ngOnInit() {
    this.settings.tipoColor = 0;
  }
}
