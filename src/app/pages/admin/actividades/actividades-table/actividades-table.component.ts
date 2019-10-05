import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AppSettings } from '../../../../app.settings';
import { Settings } from '../../../../app.settings.model';
import { NgxSmartModalService } from 'ngx-smart-modal';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { ListComponent } from '../list/list.component';
@Component({
  selector: 'app-actividades-table',
  templateUrl: './actividades-table.component.html',
  styleUrls: ['./actividades-table.component.scss']
})
export class ActividadesTableComponent implements OnInit {
  @Input() data:any;
  public actividades: any;
  public protocolos: any;
  public searchText:string;
  public settings: Settings;
  public cols: any;
  public accion = '';
  public estado;
  public actividad;
  public protocoloSeleccionado: string = ""; 
  public protocoloActual;
  public usuario:any;
  @Input()
  descripcion:any;
  estadoStr:any;
  nuevoProtocolo:any;
  constructor(
    public ngxSmartModalService: NgxSmartModalService,
    public appSettings:AppSettings,
    private _AppService: AppService,
    private auth: AuthService,
    private list: ListComponent,
    ) { 
    this.settings = this.appSettings.settings; 
    this.cols = [
      { field: 'idActividades', header: 'Id' },
      { field: 'actividades', header: 'Descripcion' },
      { field: 'orden', header: 'Orden' },
      { field: 'estado', header: 'Estado' }
  ];
  
  }
  ngOnInit() {
    this.usuario = this.auth.getDataUsuario();
    this.getProtocolos();
  }
  public getImg(imgNombre: string): string{
    return '../../../../../assets/img/'+imgNombre;
  }

  public estados = [
    {label: 'Creado', value: 0},
    {label: 'Asignado', value: 1},
    {label: 'Completado', value: 2},
    {label: 'Inactivo', value: 9},
  ] 
  // EDITAR ACTIVIDAD
  public editarActividad(id:any, fkProtocolo:any) {
    this.fkProtocolo = fkProtocolo;
    this._AppService.get('actividad/'+id).subscribe(
      data => {
        this.actividad = data;
        console.log(this.actividad.estado);
        this.accion = 'editar';
        this.estadoActividad();
        this.nuevoProtocolo = null;
      }
    );
  }

  estadoActividad(){
    if(this.actividad.estado == 0){
      this.estadoStr = 'Creado';
    }else if(this.actividad.estado == 1){
      this.estadoStr = 'Asignado';
    }else if(this.actividad.estado == 2) {
      this.estadoStr = 'Completado';
    }else if(this.actividad.estado == 9) {
      this.estadoStr = 'Inactivo';
    }
    console.log(this.estadoStr);
  }

  fkProtocolo:any;


  getEstadoActividad(e:any){
    console.log(e);
    this.estadoActividad = e;
  }
  

  getProtocloActual(e:any){
    console.log(e);
    this.nuevoProtocolo = e;
	}

  updateActividades(id:any) {
    // "orden": Object.keys(this.actividades).length+1,
/*     if (this.actividad.estadoStr == 'Completado') {
      this.actividad.estado == 9;
    }else if(this.actividad.estadoStr == 'Pendiente') {
      this.actividad.estado == 0;
    } */
    console.log(this.estadoActividad);
    const json = {
      "idActividades": this.actividad.idActividades,
      "fkEmpresa": this.usuario.empresa.idEmpresa,
      "items": 1,
      "actividades": this.actividad.actividades,
      "orden": this.actividad.orden,
      "tipo": 0,
      "estado": this.estadoActividad,
      "fkProtocolo": this.nuevoProtocolo
    }

    this._AppService.put('actividad/'+id, json).subscribe(
      result => {
        console.log(result);
        this.accion = '';
        this.list.getActividadesPorProtocolos(this.list.protocoloActual);
      }
    );
  } 

  //GET PROTOCOLOS
  public getProtocolos(){
    this._AppService.get(`protocolos/list`).subscribe(
        result =>{
          this.protocolos = result;
        },
        error =>{
          console.log(error);
        });
  }


  
  // ELIMINAR ACTIVIDAD
  public eliminarActividad(id){

    this._AppService.put(`actividad/${id}/estado/9`, {}).subscribe(
      result => {
        Swal.fire({
          title: 'Advertencia',
          text: 'Estas seguro?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Si, borrar',
          cancelButtonText: 'No, salir'
        }).then((result) => {
          if (result.value) {
            Swal.fire(
              'Deleted!',
              'Actividad Borrada con exito',
              'success'
            )
            this.list.getActividadesPorProtocolos(this.list.protocoloActual);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              'No se ha realizado ningun cambio',
              'error'
            )
          }
        }),
        error => {
          Swal.fire({
            title: 'Error!',
            text: 'Error al conectar con la base de datos',
            type:'error'
          });
        }
      }
    )

}
}





