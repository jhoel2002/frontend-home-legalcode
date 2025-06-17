import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { DataRequest } from '../../models-admin/data-request.model';
import { nameEndpints } from '../../name-enpoints/name-endpoints';
import { CaseRequest } from '../../models-admin/case-request.model';
import { Page } from '../../models-admin/pageable.model';
import { CaseRequestFull } from '../../models-admin/case-request-full';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {}

  register(codeCustomer: string, requestData: CaseRequest): Observable<any> {
    const formData = new FormData();
    formData.append('title', requestData.title);
    formData.append('description', requestData.description);
    formData.append('type_case', requestData.type_case);
    requestData.evidences?.forEach(file => formData.append('files', file, file.name));
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/saveEvidenceMassive/${codeCustomer}`;
    return this.http.post<any>(url, formData).pipe(
      catchError(this.handleError)
    );
  }

  getAllByCustomer(page: number, size: number, codeCustomer: string): Observable<Page<CaseRequestFull>> {
    const params = new HttpParams()
      .set('page', page.valueOf())
      .set('size', size.valueOf())
      .set('sort', 'asc');
    const url = `${environment.baseUrl}${nameEndpints.requestEndpoint}/infoCustomer/${codeCustomer}`;
    return this.http.get<Page<CaseRequestFull>>(url, { params }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Algo falló. Por favor intente nuevamente.';
    return throwError(() => new Error(errorMessage));
  }
}
