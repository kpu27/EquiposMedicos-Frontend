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
  aut:any;
  selectEquipos:any;
  public settings: Settings;

  constructor(
    public dialogRef:MatDialogRef<Dialog2Component>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private service: AppService, 
    public appSettings: AppSettings,
    public mgxSmartModalService: NgxSmartModalService) {
      this.settings = this.appSettings.settings;
      this.getEquiposAut()
     }
      SelectEquipos(equipos:any){
        this.selectEquipos = equipos;
        console.log(this.selectEquipos)
      }
    public getEquiposAut(){
      this.settings.loadingSpinner = true;
      this.service.get("cotizacionDetalle/cotizacion/"+this.data).subscribe(
        res=>{ console.log(res)
        this.aut=res
        this.settings.loadingSpinner = false;
      }
      )
    }

  ngOnInit() {
    console.log(this.data)
  }

  

 

}
