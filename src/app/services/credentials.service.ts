import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/enviroment';
import { NewUser } from '../interfaces/NewUser';
import { User } from '../interfaces/User';
import { Router } from '@angular/router';
import { NewTask } from '../interfaces/NewTask';


@Injectable({
    providedIn: 'root',
})
export class credentialService {

    apiUrl: string = environment.apiUrl;
    auth = new BehaviorSubject<string | null>(null);
    authToken = this.auth.asObservable();
    logoutTimer: any;
    token: string | null = null;

    constructor(private http: HttpClient, private router: Router) {

    }

    //validar email
    public validateEmail(email: string): Observable<HttpResponse<boolean>> {
        const httpUrl = this.getUrl(`/Users/ValidateEmail`);
        let httpParams = new HttpParams().set('email', email);

        return this.http.get<boolean>(httpUrl, { params: httpParams, observe: 'response' });
    }

    public getUrl(url: string): string {
        return environment.apiUrl + url;
    }

    //registrar usuario
    public RegistrarUsuario(body: NewUser): Observable<any> {

        const httpUrl = this.getUrl(`/Users/Register`);

        return this.http.post<any>(httpUrl, body);
    }


    public login(email: string, password: string): Observable<User> {
        const httpUrl = this.getUrl(`/Users/Login`);
        const credentials = { email, password };
    
        return this.http.post<User>(httpUrl, credentials).pipe(
          tap((response: User) => {
            this.setAuthToken(response.access_token, response.access_token_expiration);
            this.startLogoutTimer(response.access_token_expiration);
          })
        );
      }
    
      private setAuthToken(token: string | null, expiration: string): void {
        localStorage.setItem('authToken', token || '');
        localStorage.setItem('authTokenExpiration', expiration);
        this.auth.next(token);
      }
    
     public  getAuthToken(): string | null {
        const expiration = localStorage.getItem('authTokenExpiration');
        if (expiration) {
          const expirationTime = new Date(expiration).getTime();
          const currentTime = new Date().getTime();
    
          if (expirationTime > currentTime) {
            // Token no ha expirado
            console.log('expirationTime', expirationTime);
            console.log('currentTime', currentTime);
            this.startLogoutTimer(expiration); 
            return localStorage.getItem('authToken');
          } else {
            // Token ha expirado
            this.logout();  
            return null;
          }
        }
    
        return null;
      }
    
      private startLogoutTimer(expiration: string): void {
        this.clearLogoutTimer();
    
        const expirationTime = new Date(expiration).getTime();
        const currentTime = new Date().getTime();
        const timeToExpiration = expirationTime - currentTime;
    
        // Establecer el temporizador para el tiempo de expiración (90 minutos)
        this.logoutTimer = timer(timeToExpiration).pipe(
          switchMap(() => {
            this.logout();
            return [];
          })
        ).subscribe();
      }
    
      private clearLogoutTimer(): void {
        if (this.logoutTimer) {
          this.logoutTimer.unsubscribe();
          this.logoutTimer = undefined;
        }
      }
    
      logout(): void {
        this.clearLogoutTimer();
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiration');
        this.auth.next(null);
        this.router.navigate(['/Login']);

      }
      
      public categorias(): Observable<any[]> {
        const httpUrl = this.getUrl(`/Categories`);
        this.token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

        return this.http.get<any[]>(httpUrl, { headers});
    }
     
    public CrearTask(body: NewTask): Observable<any> {

      const httpUrl = this.getUrl(`/Tasks`);
      this.token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      return this.http.post<any>(httpUrl, body, { headers});
  }

  public countTask(): Observable<any[]> {
    const httpUrl = this.getUrl(`/Tasks/incomplete-count`);
    this.token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    return this.http.get<any[]>(httpUrl, { headers});
}
}
