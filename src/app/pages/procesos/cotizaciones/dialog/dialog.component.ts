import { Component, OnInit} from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import Scrollbar from 'smooth-scrollbar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  options = { autoHide: false, scrollbarMinSize: 100 };
  cotizacion:any;

  constructor(private api:AppService) { }

  ngOnInit() {

  this.getCotizacionById(7);
  }

  getCotizacionById(id:number)
  {
    this.api.get(`cotizaciones/${id}`).subscribe(
      (data) => {
        console.log(data);
        this.cotizacion = JSON.parse(data);
      },
      (error) => {
        console.log(error);
      }
    )
  }

}
