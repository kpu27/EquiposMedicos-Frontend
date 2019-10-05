import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CotizacionesPorAprovarComponent } from '../cotizaciones-por-aprovar/cotizaciones-por-aprovar.component';
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
  aut:any;

  constructor(
    public dialogRef:MatDialogRef<CotizacionesPorAprovarComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private service: AppService, 
    public mgxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
  }

  public getEquiposAut(){
    this.service.get("/cotizacionDetalle/cotizacion/"+this.data).subscribe(
      res=>{ console.log(res)
      this.aut=res}
    )
  }

 

}
