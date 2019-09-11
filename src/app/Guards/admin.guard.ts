import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, OnInit {

  public usuario: any;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = this.auth.getDataUsuario();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (this.auth.isAuthenticated()) {
        if (this.isTokenExpired()) {
          this.auth.logout();
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }

  isTokenExpired(): boolean {
    let token = this.auth.token;
    let payload = this.auth.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }
}