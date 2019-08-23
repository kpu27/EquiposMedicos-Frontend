import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [  ]
})
export class RegisterComponent implements OnInit {
  public settings: Settings;
  

  constructor(public appSettings:AppSettings) { 
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.settings.loadingSpinner = false;
    
  }






}
