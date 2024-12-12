import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { enviroment } from '../enviroment/enviroment';
import { SchoolResponse } from '../response/school.respone';
import { BaseResponse } from '../response/base.response';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private apiSchool = `${enviroment.apiBaseUrl}/school`;
  constructor(private http: HttpClient) {}
  getSchools(
    keyword: string,
    countryCode:string,
    page: number,
    limit: number
  ): Observable<BaseResponse<SchoolResponse>> {
    const param = new HttpParams()
      .set('keyword', keyword)
      .set('coutryCode',countryCode)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<BaseResponse<SchoolResponse>>(this.apiSchool, {
      params: param,
    });
  }
  getSchool(id: string): Observable<BaseResponse<SchoolResponse>> {
    const param = new HttpParams().set('id', id);
    return this.http.get<BaseResponse<SchoolResponse>>(this.apiSchool, {
      params: param,
    });
  }
  deleteSchool(id: string): Observable<any> {
    const param = new HttpParams().set('id', id);
    return this.http.delete(this.apiSchool, { params: param });
  }
  createSchool(data: any): Observable<BaseResponse<SchoolResponse>> {
    return this.http.post<BaseResponse<SchoolResponse>>(this.apiSchool, data);
  }
  updateSchool(data: any): Observable<BaseResponse<SchoolResponse>> {
    return this.http.put<BaseResponse<SchoolResponse>>(this.apiSchool, data);
  }
}
