import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.scss']
})
export class CotizacionesComponent implements OnInit {
  public cotizacionesList:Array<any>;
  public cotizaciones:Array<any> = [];
  public newCotizacionesText:string = '';

  constructor( private router: Router, private _AppService: AppService) {}

  ngOnInit(){
    this.getCotizaciones();
  }

  public getCotizaciones(){
    this._AppService.get('cotizaciones/list').subscribe(
      (data: any) => { this.cotizaciones = data}
    );
  }

  public goToCotizaciones(){
    this.router.navigate(['procesos/cotizaciones']);
  }
}