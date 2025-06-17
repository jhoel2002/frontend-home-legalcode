import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AuthResponse } from '../../models-admin/auth-response.model';
import { AuthData } from '../../models-admin/auth-data.model';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  authorities: string;
  exp: number;
  codeCustomer: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isBrowser: boolean;

  private http = inject(HttpClient);

  private readonly buffet = 'XEV319';
  private static readonly TOKEN_KEY = 'token';

  currentUserData$: BehaviorSubject<AuthResponse> =new BehaviorSubject<AuthResponse>({
    username: '',
    role: '',
    token: '',
    buffet: this.buffet,
    codeCustomer: ''
  });

  currentUserLoginOn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const token = localStorage.getItem(AuthService.TOKEN_KEY);
      if (token && !this.isExpired(token)) {
        const userData = this.decodeToken(token);
        this.currentUserData$.next({ ...userData, token, buffet: this.buffet,  codeCustomer: userData.codeCustomer });
        this.currentUserLoginOn$.next(true);
      }
    }
  }

  private decodeToken(token: string): { username: string; role: string; codeCustomer: string } {
    const payload = jwtDecode<JwtPayload>(token);
    let role = '';
    let codeCustomer = '';

    try {
      const authoritiesArray = JSON.parse(payload.authorities) as { authority: string }[];
      role = authoritiesArray?.[0]?.authority || '';
      codeCustomer = payload.codeCustomer || '';
      console.log('Cliente:', codeCustomer);
    } catch (error) {
      console.warn('No se pudo parsear authorities del token:', error);
    }

    return {
      username: payload.sub,
      role,
      codeCustomer
    };
  }

  login(credentials: AuthData): Observable<any> {
    // const headers = { 'skip-interceptor': 'true' };
    return this.http.post<any>(`${environment.baseUrl}login`, credentials).pipe(
      tap(({ token }) => {
        // Guarda sólo el token
        localStorage.setItem(AuthService.TOKEN_KEY, token);

        // Actualiza subjects
        const userData = this.decodeToken(token);
        this.currentUserData$.next({ ...userData, token, buffet: this.buffet });
        this.currentUserLoginOn$.next(true);
      }),
      map(({ token }) => ({ ...this.decodeToken(token), token, buffet: this.buffet })),
      catchError(this.handleError)
    );
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(AuthService.TOKEN_KEY);
    this.currentUserData$.next({ username: '', role: '', token: '', buffet: this.buffet, codeCustomer: '' });
    this.currentUserLoginOn$.next(false);
  }

  private isExpired(token: string): boolean {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (typeof exp !== 'number') {
        return true;
      }
      return Date.now() / 1000 >= exp;
    } catch {
      return true;
    }
  }
  
  isTokenValid(): boolean {
    if (!this.isBrowser) return false;

    const token = this.userToken || localStorage.getItem(AuthService.TOKEN_KEY);
    return token ? !this.isExpired(token) : false;
  }

  // Observar los datos del usuario
  get userData(): Observable<AuthResponse> {
    return this.currentUserData$.asObservable();
  }

  // Observar si el usuario está autenticado
  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn$.asObservable();
  }

  // Obtener el token del usuario
  get userToken(): string {
    return this.currentUserData$.value.token;
  }

  get userCode(): string {
    return this.currentUserData$.value.codeCustomer;
  }

  get userBuffet(): string {
    return this.currentUserData$.value.buffet;
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    if (error.status === 403 || error.status === 500) {
      errorMessage = 'Credenciales incorrectas.';
    }
    return throwError(() => new Error(errorMessage));
  }
}
