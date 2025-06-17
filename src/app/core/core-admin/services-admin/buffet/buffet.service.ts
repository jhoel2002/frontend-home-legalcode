import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuffetService {

  constructor(private http: HttpClient) {}

  getTypeCasesByCode(code: string): Observable<any> {
    const url = `${environment.baseUrl}${nameEndpints.buffetEndpoint}/typeCases/${code}`;
    return this.http.get<any>(url);
  }

}
