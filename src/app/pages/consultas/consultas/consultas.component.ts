import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Settings } from '../../../app.settings.model';
import { AppSettings } from '../../../app.settings';


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
  data4:any;
  data:any;
  alison:any;
  options = {
	
		
	}
  public cols: any[];
  public settings: Settings;
  public info: Array<any> = [];


  constructor( private datePipe: DatePipe,private service:AppService, 
    private servicio: AuthService,
    public appSettings: AppSettings,) { 
    this.settings = this.appSettings.settings;
    this.cols = [
      { header: 'Equipo' },
      {  header: 'Marca' },
      {  header: 'Programado' },
      {  header: 'Realizado' },
      {  header: 'Cliente' },
      
  ];  
 
  }
  public getClientes() {
    this.settings.loadingSpinner = true;
    this.service.get('clientes/empresa/'+this.usuario.empresa.idEmpresa).subscribe(
      (data: any) => {   
        this.clientes = data;
        this.settings.loadingSpinner = false;
        
      },
      error=>{
        this.settings.loadingSpinner = false;
      }
    );
  }
  //Mantenimiento pendiente de los clientes
  public getConsulta1(){
    this.settings.loadingSpinner = true;
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/cliente1/'+this.usuario.empresa.idEmpresa).subscribe(
      (res:any)=>{console.log(res)
       /* data = res[0];
        this.data1=data[0];
        this.data2=data[1];
        this.data3=data[2];*/
        this.settings.loadingSpinner = false;
    }
    )
  }    
//listar por cliente y los equipos
  public getConsulta2(){
    this.settings.loadingSpinner = true;
    let fechai = this.datePipe.transform(this.fechai4, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf4, 'yyyy-MM-dd')
    this.service.get('ordenesDetalle/cliente/'+this.usuario.empresa.idEmpresa+'/'+this.ClienteSelect+'/'+fechai+'/'+fechaf).subscribe(
      res=>{ console.log(res)
        this.sql1=res
        this.settings.loadingSpinner = false;
      }, error=>{
        console.log(error)
      }
    )
  }
  //listar por tecnicos y sus equipos
  public getConsulta3(){
    this.settings.loadingSpinner = true;
    let fechai = this.datePipe.transform(this.fechai2, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf2, 'yyyy-MM-dd')
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/tecnico/'+this.usuario.empresa.idEmpresa+'/'+this.TecnicoSelect+'/'+fechai+'/'+fechaf).subscribe(
      res=>{   console.log(res)
      this.sql2=res  
      this.settings.loadingSpinner = false;
      },error=>{
        console.log(error)
      }
    )
  }
  //listar todos los tecnicos con equipos
  public getConsulta4(){
    this.settings.loadingSpinner = true;
    let fechai = this.datePipe.transform(this.fechai1, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf1, 'yyyy-MM-dd')
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/responsable2/'+this.usuario.empresa.idEmpresa+'/'+fechai+'/'+fechaf).subscribe(
      (res:any)=>{console.log(res);
        if(res.length > 0){


          let label = [];
          let datos = []
          res.forEach(d => {
             label.push(d[3]);
             datos.push(d[2]);
          });




          data = res[0];
          this.data1=data[0];
          this.data2=data[1];
          this.data3=data[2];
          this.data4=data[3];
          this.info = res;
          this.settings.loadingSpinner = false;
        

          this.data = {
          labels: label,
          datasets: [
              {
                  label: 'Numero de equipos',
                  data: datos,
                  backgroundColor:'#429d8a',
                  borderColor:'#429d8a'
              }
          ]
      }
        }
     
      }
        
    ),error=>{console.log(error)}
  }
  //Programacion por tecnico
  public getConsulta5(){
    this.settings.loadingSpinner = true;
    let fechai = this.datePipe.transform(this.fechai3, 'yyyy-MM-dd')
    let fechaf = this.datePipe.transform(this.fechaf3, 'yyyy-MM-dd')
    let data: Array<any> = [];
    this.service.get('ordenesDetalle/responsable/'+this.usuario.empresa.idEmpresa+'/'+fechai+'/'+fechaf).subscribe(
      res=>{console.log(res)
        data = res[0];
        this.data1=data[0];
        this.data2=data[1];
        this.data3=data[2];
        this.settings.loadingSpinner = false;
      }
    )
  }
 
  public getTecnicos() {
    this.settings.loadingSpinner = true;
    this.service.get('tecnicos/list').subscribe(
      data => {
        console.log(data)
        this.tecnicos = data;
       
        this.settings.loadingSpinner = false;
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
