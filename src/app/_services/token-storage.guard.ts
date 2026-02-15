import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate , Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
    providedIn: 'root'
})

export class TokenStorageGuard implements CanActivate {
    constructor(private tokenService: TokenStorageService, private router: Router) {}

    canActivate() {
        if(this.tokenService.isLoggedin() == true) {
            return true;
        }

        alert("You have not logged In, Please! Logged In");
        this.router.navigate(['login']);
        return false;
    }
}