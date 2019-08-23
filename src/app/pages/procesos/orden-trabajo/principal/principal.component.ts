import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit {
  public settings: Settings;
  public ordenes: any;
  public cotizaciones: any;
  public cotizacion: any;
  public cotizacionDetalles: any;
  public estado = 'ordenes'
  //MENSAJES DE ERROR
  error_en_La_consulta: any = { type: 'error', title: 'Ha ocurrido un error en la consulta' };
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
  constructor(public appSettings: AppSettings,
    private _AppService: AppService) { this.settings = this.appSettings.settings }

  ngOnInit() {
    this.getOrdenes();
  }

  verCotizaciones() {
    this.settings.loadingSpinner = true;
    this._AppService.get(`cotizaciones/list`).subscribe(
      result => { this.settings.loadingSpinner = false; this.cotizaciones = result; this.estado = 'cotizaciones' },
      error => { this.Toast.fire(this.error_en_La_consulta) }
    );
  }

  crearOrden(cotizacion) {
    this._AppService.get(`cotizacionDetalle/cotizacion/${cotizacion.idCotizEncab}`).subscribe(result => { this.cotizacionDetalles = result; this.cotizacion = cotizacion; this.estado = 'agregarOrden' },
      error => { this.Toast.fire(this.error_en_La_consulta) });
  }

  //GET INSTRUMENTOS
  public getOrdenes() {
    this.settings.loadingSpinner = true;
    this._AppService.get(`ordenes/list`).subscribe(
      result => { this.settings.loadingSpinner = false; this.ordenes = result; },
      error => { this.Toast.fire(this.error_en_La_consulta); }
    );
  }

  irA(estado) { this.estado = estado };
}
