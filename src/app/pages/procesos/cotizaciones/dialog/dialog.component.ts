import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Settings } from '../../../../app.settings.model';
import { AppSettings } from '../../../../app.settings';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  cotizacion: any;
  items: any;
  public settings: Settings;
  subTotal: Array<any> = [];
  monto: number = 0;
  datos:any;
  datosDetalles:any;
  constructor(
    public appSettings: AppSettings,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private servicio: AppService, public ngxSmartModalService: NgxSmartModalService) {
      this.settings = this.appSettings.settings;
      this.getDatosUSuario()
      this.getDatosDetalle()
     }

  ngOnInit() {
    this.getSubTotal(this.data.idCotizEncab);
    document.getElementById("print").addEventListener("click", this.printElement);
  }

  getTotal() {
    for (let i = 0; i < this.subTotal.length; i++) {
      console.log(this.subTotal[i]);
      this.monto += parseInt(this.subTotal[i]);
    }
    console.log(this.monto);
  }
  
  public getDatosUSuario(){

    this.servicio.get('cotizaciones/'+this.data.idCotizEncab).subscribe(
      res=>{ 
        this.datos=res
        console.log(res)
      }
    )
  }

  public getDatosDetalle(){
    this.settings.loadingSpinner = true;
    this.servicio.get('cotizacionDetalle/cotizacion/'+this.data.idCotizEncab).subscribe(
      res=>{
        this.datosDetalles=res
        console.log(res)
        this.settings.loadingSpinner = false;
      }
    )
  }

  getSubTotal(id: number) {
    this.servicio.get(`cotizacionDetalle/sumatoria/${id}`).subscribe(
      (data: any) => {
        console.log(data);
        if (data.length > 0) {
          this.subTotal = data;
          this.getTotal();
        }
      }
    )
  }

  closeDialog(){
    this.dialogRef.close();
  }

  printElement() {
    let originalPage = document.body.innerHTML;
    let printPage = document.getElementById("printElement").innerHTML;

    var winprint = window.open('', "PrintWindow", "width=5,height=5,top=200,left=200,toolbars=no,scrollbars=no,status=no,resizable=no");
    winprint.document.write('<html><head><style type="text/css">');
    winprint.document.write('body,td,th{font-family:Arial, Helvetica, sans-serif;font-size:10px;color:#000000}');
    winprint.document.write('.style1 {font-size:11px; font-weight:bold; color:#000000; }');
    winprint.document.write('.borderTable {border:solid 2px black;}');
    winprint.document.write('.infor2{position:relative; left:20px}');
    winprint.document.write('</style></head><body onload="window.print();">');
    winprint.document.writeln(printPage);
    winprint.document.write('</body></html>');
    winprint.document.close();
    winprint.focus();
    winprint.print();
    winprint.close();

    document.body.innerHTML = printPage;
    window.print();
    document.body.innerHTML = originalPage;
    return true;
  }

}
