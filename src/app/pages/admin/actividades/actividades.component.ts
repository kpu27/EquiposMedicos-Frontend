import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import {Slide} from '../../../services/constants';
@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.component.html',
  styleUrls: ['./actividades.component.scss'],
  animations: [Slide]
})
export class ActividadesComponent implements OnInit {
  public data:any;
  constructor(private _AppService:AppService) { }

  ngOnInit() {
  }



}
