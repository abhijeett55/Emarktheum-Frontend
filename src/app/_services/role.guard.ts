import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';


@Injectable({
  providedIn: 'root',
})

export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenStorageService
    ) { }

  canActivate(): boolean {
    const user = this.tokenService.getUser();

    if (user && user.roles && user.roles.includes('ROLE_ADMIN')) {
      return true;
    }

    alert("You don't have admin rights");
    this.router.navigate(['/']);
    return false;

  }

}
