import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { credentialService } from '../services/credentials.service';

@Injectable({
  providedIn: 'root'
})
export class AutherizationGuard implements CanActivate {
  
  constructor(private router: Router, private cred: credentialService) {}

  canActivate(): boolean { 
    if (this.cred.getAuthToken() !== null) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
  
}
