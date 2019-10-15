import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss'],
  providers:[DatePipe]
})
export class ConsultasComponent implements OnInit {
  opciones:string;
  clientes: any;
  clientes1:any;
  ClienteSelect:any;
  TecnicoSelect:any;
  tecnicos: any;
  formularios:any;
  usuario:Usuario;
  fechai1:any;
  fechai2:any;
  fechai3:any;
  fechai4:any;
  fechaf1:any;
  sql1:any;
  sql2:any;
  fechaf2:any;
  fechaf3:any;
  fechaf4:any;
  data1:any = {};
  data2:any = {};
  data3:any = 0;
  data:any;
  alison:any;


  constructor( private datePipe: DatePipe,private service:AppService, private servicio: AuthService) { 

    this.alison = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'Mi primer chart',
              backgroundColor: '#42A5F5',
              borderColor: '#1E88E5',
              alison: [65, 59, 80, 81, 56, 55, 40]
          }
      ]
  }
  }
  public getClientes() {
    this.service.get('clientes/empresa/'+this.usuario.empresa.idEmpresa).subscribe(
      (data: any) => {
        this.clientes = data;
        
      }
    );
  }
  //Mantenimiento pendiente de los clientes
  public getConsulta1(){
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/cliente1/'+this.usuario.empresa.idEmpresa).subscribe(
      (res:any)=>{
        data = res[0];
        this.data1=data[0];
        this.data2=data[1];
        this.data3=data[2];
    }
    )
  }    
//listar por cliente y los equipos
  public getConsulta2(){
    let fechai = this.datePipe.transform(this.fechai4, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf4, 'yyyy-MM-dd')
    this.service.get('ordenesDetalle/cliente/'+this.usuario.empresa.idEmpresa+'/'+this.ClienteSelect+'/'+fechai+'/'+fechaf).subscribe(
      res=>{this.sql1=res
      }, error=>{
        console.log(error)
      }
    )
  }
  //listar por tecnicos y sus equipos
  public getConsulta3(){
    let fechai = this.datePipe.transform(this.fechai2, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf2, 'yyyy-MM-dd')
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/tecnico/'+this.usuario.empresa.idEmpresa+'/'+this.TecnicoSelect+'/'+fechai+'/'+fechaf).subscribe(
      res=>{
      this.sql2=res  
      },error=>{
        console.log(error)
      }
    )
  }
  //listar todos los tecnicos con equipos
  public getConsulta4(){
    let fechai = this.datePipe.transform(this.fechai1, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf1, 'yyyy-MM-dd')
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/responsable2/'+this.usuario.empresa.idEmpresa+'/'+fechai+'/'+fechaf).subscribe(
      res=>{
        data = res[0];
        this.data1=data[0];
        this.data2=data[1];
        this.data3=data[2];}
    ),error=>{console.log(error)}
  }
  //Programacion por tecnico
  public getConsulta5(){
    let fechai = this.datePipe.transform(this.fechai3, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf3, 'yyyy-MM-dd')
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/responsable/'+this.usuario.empresa.idEmpresa+'/'+fechai+'/'+fechaf).subscribe(
      res=>{
        data = res[0];
        this.data1=data[0];
        this.data2=data[1];
        this.data3=data[2];
      }
    )
  }
 
  public getTecnicos() {
    this.service.get('tecnicos/list').subscribe(
      data => {
        this.tecnicos = data;
      },
      error => {
        console.log(error)
      }
    )
  }
  SelectCliente(cliente:any){
    this.ClienteSelect = cliente;
  }

  SelectTecnico(tenico:any){
    this.TecnicoSelect = tenico;
  }

  ngOnInit() {
    this.usuario = this.servicio.obtenerDatosUser();
    this.getClientes();
    this.getTecnicos();
  }

}
