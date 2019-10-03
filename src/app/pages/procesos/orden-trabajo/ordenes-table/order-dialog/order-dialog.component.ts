import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {

  cotizacion: any;
  items: any;
  subTotal: Array<any> = [];
  monto: any = 0;

  constructor(private api: AppService, public mgxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    document.getElementById("print").addEventListener("click", this.printElement);
  }

  getTotal() {
    for (let i = 0; i < this.subTotal.length; i++) {
      this.monto += parseInt(this.subTotal[i]);
    }

  }

  getSubTotal(id: number) {
    this.api.get(`cotizacionDetalle/sumatoria/8`).subscribe(
      (data: any) => {
        console.log(data);
        if (data.length > 0) {
          this.subTotal = data;
          this.getTotal();
        }
      }
    )
  }

  getCotizacionById(id: number) {
    this.api.get(`cotizaciones/${id}`).subscribe(
      (data) => {
        console.log(data);
        this.cotizacion = data;
      },
      (error) => {
        console.log(error);
      }
    )
  }
  getItemsCotizados(idCotizacion: number) {
    this.api.get(`cotizacionDetalle/cotizacion/${idCotizacion}`).subscribe(
      (data) => {
        console.log(data);
        this.items = data;
      }
    )
  }

  printElement() {
    let originalPage = document.body.innerHTML;
    let printPage = document.getElementById("printElement").innerHTML;

    var winprint = window.open('', "PrintWindow", "width=5,height=5,top=200,left=200,toolbars=no,scrollbars=no,status=no,resizable=no");
    winprint.document.write('<html><head><style type="text/css">');
    winprint.document.write('body,td,th{font-family:Arial, Helvetica, sans-serif;font-size:10px;color:#000000}');
    winprint.document.write('.style1 {font-size:11px; font-weight:bold; color:#000000; }');
    winprint.document.write('.borderTable {border:solid 2px black;}');
    winprint.document.write('@import url("../../../../../../node_modules/bootstrap/dist/css/bootstrap.min.css")');
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
