import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Settings } from '../../../../app.settings.model';
import { AppSettings } from '../../../../app.settings';
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
  public settings: Settings;
  selectedValues: String[] = [];
  constructor(
    public dialogRef: MatDialogRef<Dialog2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: AppService,
    public appSettings: AppSettings,
    public mgxSmartModalService: NgxSmartModalService) {
    this.settings = this.appSettings.settings;
    this.getEquiposAut()
  }
  //LISTAR LOS EQUIPOS DE CADA UNO DE LA COTIZACION
  public getEquiposAut() {
    this.settings.loadingSpinner = true;
    this.service.get("cotizacionDetalle/cotizacion/" + this.data).subscribe(
      res => {
        console.log(res)
        this.aut = res
        this.settings.loadingSpinner = false;
      }
    )
  }
  //METODO EN EL CUAL SE VAN ACTUALIZAR LOS ITEMS YA SELECCIONADOS
  public update() {
    for (let index = 0; index < this.getitem.length; index++) {
      const element = this.getitem[index];
      if (element > 0) {
        this.service.get('cotizacionDetalle/updateEstado/' + index).subscribe(
          res => {
            console.log(res)
          }
        )
      }
    }
  }
  //METODO ARRAY EN EL SE GUARDAN LOS ITEMS SELECCIONADOS
  getitem(data: any) {
    switch (data.value) {
      case true:
        this.itemsSeleccionados.push(data.id);
        console.log(this.itemsSeleccionados)
        break;
      case false:
        this.deleteItem(data.id);
        break;
      default:
        break;
    }
  }

  //METODO PARA ELIMINAR ITEM DESELECIONADO 
  deleteItem(id: number) {
    for (let index = 0; index < this.itemsSeleccionados.length; index++) {
      const element = this.itemsSeleccionados[index];
      if (element === id) {
        this.itemsSeleccionados.splice(index, 1);
      }
    }
  }

  ngOnInit() {

  }





}
