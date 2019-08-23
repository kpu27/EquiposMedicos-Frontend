import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';

@Component({
  selector: 'app-procesos',
  templateUrl: './procesos.component.html',
  styleUrls: ['./procesos.component.scss']
})
export class ProcesosComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  public settings: Settings;
  public sidenavOpen:boolean = true;
  public newMail: boolean;
  public type:string = 'all';
  public searchText: string;
  public form:FormGroup;

  constructor(public appSettings:AppSettings, 
              public formBuilder: FormBuilder, 
              public snackBar: MatSnackBar) { 
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() { 
  
  }

 

}
