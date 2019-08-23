import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { orders, products, customers, refunds } from '../dashboard.data';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit {
  public orders: any[];
  public products: any[];
  public customers: any[];
  public refunds: any[];
  public colorScheme = {
    domain: ['#999']
  };
  public autoScale = true;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  public settings: Settings;
  public equipos = 0;
  public protocolos = 0;
  public instrumentos = 0;
  public tecnicos = 0;
  constructor(private router: Router, private _AppService: AppService, public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.orders = orders;
    this.products = products;
    this.customers = customers;
    this.refunds = refunds;
    this.orders = this.addRandomValue('orders');
    this.customers = this.addRandomValue('customers');
    this.countEquipos();
    this.countProtocolos();
    this.countInstrumentos();
    this.countTecnicos();
  }

  public countEquipos() {
    this._AppService.get('equipos/count').subscribe((data: any) => { this.equipos = data });
  }

  public countProtocolos() {
    this._AppService.get('protocolos/count').subscribe((data: any) => { this.protocolos = data });
  }
  
  public countInstrumentos() {
    this._AppService.get('instrumentos/count').subscribe((data: any) => { this.instrumentos = data });
  }

  public countTecnicos() {
    this._AppService.get('tecnicos/count').subscribe((data: any) => { this.tecnicos = data });
  }

  public goToEquipos(){
    this.router.navigate(['admin/equipos']);
  }
  public goToProtocolos(){
    this.router.navigate(['admin/protocolos']);
  }
  public goToInstrumentos(){
    this.router.navigate(['admin/instrumentos']);
  }
  public goToTecnicos(){
    this.router.navigate(['admin/tecnicos']);
  }

  public onSelect(event) {
    console.log(event);
  }

  public addRandomValue(param) {
    switch (param) {
      case 'orders':
        for (let i = 1; i < 30; i++) {
          this.orders[0].series.push({ "name": 1980 + i, "value": Math.ceil(Math.random() * 1000000) });
        }
        return this.orders;
      case 'customers':
        for (let i = 1; i < 15; i++) {
          this.customers[0].series.push({ "name": 2000 + i, "value": Math.ceil(Math.random() * 1000000) });
        }
        return this.customers;
      default:
        return this.orders;
    }
  }

  ngOnDestroy() {
    this.orders[0].series.length = 0;
    this.customers[0].series.length = 0;
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      setTimeout(() => this.orders = [...orders]);
      setTimeout(() => this.products = [...products]);
      setTimeout(() => this.customers = [...customers]);
      setTimeout(() => this.refunds = [...refunds]);
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }
}