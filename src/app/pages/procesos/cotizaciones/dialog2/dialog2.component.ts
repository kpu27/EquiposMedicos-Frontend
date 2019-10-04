import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
@Component({
  selector: 'app-dialog2',
  templateUrl: './dialog2.component.html',
  styleUrls: ['./dialog2.component.scss']
})
export class Dialog2Component implements OnInit {

  cotizacion: any;
  items: any;
  subTotal: Array<any> = [];
  monto: any = 0;

  constructor(private service: AppService, public mgxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {

  }

  public getEquiposAut(){
    this.service.get("/cotizacionDetalle/cotizacion/").subscribe(
      res=>{}
    )
  }

 
  getItemsCotizados(idCotizacion: number) {
    this.service.get(`cotizacionDetalle/cotizacion/${idCotizacion}`).subscribe(
      (data) => {
        console.log(data);
        this.items = data;
      }
    )
  }

 

}
