import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';
import { APP } from 'src/app/services/constants';
import { AppService } from 'src/app/services/app.service';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ]
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenavPS') sidenavPS: PerfectScrollbarComponent;
  public usuario : any;
  public roles: any;
  public menuItems:Array<any>;
  public settings: any;
  public idUser: any;
  public urlImages = APP.UrlImages;
  public nombreFoto;
  constructor(
    private router: Router, 
    public appSettings:AppSettings, 
    public menuService:MenuService, 
    private authService: AuthService, 
    private appService:AppService){
      this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    this.menuItems = this.menuService.getVerticalMenuItems();
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    this.roles = this.usuario.roles[0];
    this.idUser = this.usuario.id;
    this.getDataUser(this.idUser);
  }

  public cerrarSession(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public closeSubMenus(){
    let menu = document.querySelector(".sidenav-menu-outer");
    if(menu){
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if(child){
          if(child.children[0].classList.contains('expanded')){
              child.children[0].classList.remove('expanded');
              child.children[1].classList.remove('show');
          }
        }
      }
    }
  }

  getDataUser(id:any){
    this.appService.get(`usuarios/${id}`).subscribe(
      result=>{
        this.nombreFoto = result['foto'];
        this.settings.img = result['foto'];
      }
    );

  }

  public updatePS(e){
    this.sidenavPS.directiveRef.update();
  }

}
