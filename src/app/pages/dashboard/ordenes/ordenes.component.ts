import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {
  public ordenes:Array<any> = [];
  public newOrdenesText:string = '';

  constructor(private router: Router, private _AppService: AppService) {}

  ngOnInit(){
    this.getOrdenes();
  }

  public getOrdenes(){
    this._AppService.get('ordenes/list').subscribe(
      (data: any) => { this.ordenes = data}
    );
  }

  public goToOrdenes(){
    this.router.navigate(['procesos/orden-trabajo']);
  }


}