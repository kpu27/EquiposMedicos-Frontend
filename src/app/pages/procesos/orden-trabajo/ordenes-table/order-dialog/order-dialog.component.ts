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
  }

  

}
