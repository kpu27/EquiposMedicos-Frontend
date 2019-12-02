import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Settings } from '../../../../app.settings.model';
import { AppSettings } from '../../../../app.settings';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  aut: any;
  equiposSeleccionados = []
  itemsSeleccionados: Array<any> = [];
  equipos: any;
  selectEquipos: any;
  update:any;
  public settings: Settings;
  selectedValues: String[] = [];
  constructor(
    public dialogRef: MatDialogRef<Dialog2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: AppService,
    public appSettings: AppSettings,
    public router :Router,
    public mgxSmartModalService: NgxSmartModalService) {
    this.settings = this.appSettings.settings;
    this.getEquiposAut()
  }
  //LISTAR LOS EQUIPOS DE CADA UNO DE LA COTIZACION
  public getEquiposAut() {
    this.settings.loadingSpinner = true;
    this.service.get("cotizacionDetalle/cotizacion/" + this.data.idCotizEncab).subscribe(
      res => {
        this.aut = res
        this.settings.loadingSpinner = false;
      }
    )
  }

//METODO EN EL CUAL SE VAN ACTUALIZAR LOS ITEMS YA SELECCIONADOS
  enviarCotizacionesDetalle(){
      if(this.itemsSeleccionados.length != 0 && this.itemsSeleccionados != null){
        this.settings.loadingSpinner = true;
        this.service.put('cotizaciondetalle/updateestados/'+this.data.idCotizEncab, this.itemsSeleccionados).subscribe(
          result => {this.settings.loadingSpinner = false, this.alert('Autorizado con exito'), 
        this.router.navigate(['procesos/programar-orden']) },
          error => {this.settings.loadingSpinner = false}
        )
      }
  }

  setCantidad(item:any, e:any) {
    for (let index = 0; index < this.itemsSeleccionados.length; index++) {
      const element = this.itemsSeleccionados[index];
      if(element.idCotizDeta == item.idCotizDeta) {
        this.itemsSeleccionados[index].cantidad = e.target.value
        
        break;
      }
    }
  }
  //METODO ARRAY EN EL SE GUARDAN LOS ITEMS SELECCIONADOS
  getitem(evento , data) {
    switch (evento) {
      case true:
        this.itemsSeleccionados.push(data);
        break;
      case false:
        this.deleteItem(data);
        break;
    }
  }
  closeDialog(){
    this.dialogRef.close();
  }

  //METODO PARA ELIMINAR ITEM DESELECIONADO 
  deleteItem(item: any) {
    for (let index = 0; index < this.itemsSeleccionados.length; index++) {
      const element = this.itemsSeleccionados[index];
      if (element.idCotizDeta === item.idCotizDeta) {
        this.itemsSeleccionados.splice(index, 1);
      }
    }
  }

  ngOnInit() {

  }

  alert(title: string){
    Swal.fire({
      type: 'success',
     title: 'Autorizado con exito!'
    })
  }



}
