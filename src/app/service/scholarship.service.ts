import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../enviroment/enviroment';
import { Observable } from 'rxjs';
import { ScholashipResponse } from '../response/scholarship.response';
import { BaseResponse } from '../response/base.response';

@Injectable({
  providedIn: 'root',
})
export class ScholashipService {
  private apiScholarship = `${enviroment.apiBaseUrl}/scholarship`;
  private apiExpiringScholarship = `${enviroment.apiBaseUrl}/scholarship/expiring-scholarship`;
  private apiScholarshipsUpdatedLastWeek = `${enviroment.apiBaseUrl}/scholarship/scholarships-updated-last-week`;
  private apiCountByMonth = `${enviroment.apiBaseUrl}/scholarship/scholarships-by-month`;
  private apiCountByCountry = `${enviroment.apiBaseUrl}/scholarship/scholarships-top-countries`;
  private apiCountByFieldOfStudy = `${enviroment.apiBaseUrl}/scholarship/scholarships-top-field-of-study`;
  private apiCountByTopSearch = `${enviroment.apiBaseUrl}/scholarship/top-search`;
  private apiSaveScholarship = `${enviroment.apiBaseUrl}/user/save-scholarship`;
  private apiGetSavedScholarships = `${enviroment.apiBaseUrl}/user/saved-scholarships`;
  private apiUnSaveScholarship = `${enviroment.apiBaseUrl}/user/unsave-scholarship`;
  constructor(private http: HttpClient) {}
  getScholarships(
    keyword: string,
    countryCode: string,
    fosId:string,
    page: number,
    limit: number
  ): Observable<BaseResponse<ScholashipResponse>> {
    const param = new HttpParams()
      .set('keyword', keyword)
      .set('countryCode',countryCode)
      .set('discipline',fosId)
      .set('page', page)
      .set('limit', limit);
    return this.http.get<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      {
        params: param,
      }
    );
  }
  getScholarship(id: string): Observable<BaseResponse<ScholashipResponse>> {
    const param = new HttpParams().set('id', id);
    return this.http.get<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      {
        params: param,
      }
    );
  }
  saveScholarship(id: number): Observable<BaseResponse<String>> {
  const params = new HttpParams().set('id', id);
  return this.http.post<BaseResponse<String>>(
    this.apiSaveScholarship,
      {}, 
      { params } 
  );
  }
  unSaveScholarship(id: number): Observable<BaseResponse<string>> {
  const options = {
    params: new HttpParams().set('id', id.toString())
  };
  return this.http.delete<BaseResponse<string>>(
    this.apiUnSaveScholarship,
    options
  );
}

  getSavedScholarships(): Observable<BaseResponse<ScholashipResponse>> {
    return this.http.get<BaseResponse<ScholashipResponse>>(this.apiGetSavedScholarships);
  }
  getExpiringScholarship():  Observable<BaseResponse<number>> {
    return this.http.get<BaseResponse<number>>(this.apiExpiringScholarship);
  }
  getScholarshipsUpdatedLastWeek(): Observable<BaseResponse<number>> {
    return this.http.get<BaseResponse<number>>(this.apiScholarshipsUpdatedLastWeek);
  }
  getScholarshipsByMonth(): Observable<BaseResponse<any>> {

    return this.http.get<BaseResponse<any>>(this.apiCountByMonth);      
  }
  getScholarshipsByCountry(): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(this.apiCountByCountry);
  }
  getScholarshipsByFieldOfStudy(): Observable<BaseResponse<any>> {
     return this.http.get<BaseResponse<any>>(this.apiCountByFieldOfStudy);
  }
  getScholarshipsByTopSearch(): Observable<BaseResponse<any>> {
    return this.http.get<BaseResponse<any>>(this.apiCountByTopSearch);
  }
  deleteScholarship(id: string): Observable<any> {
    const param = new HttpParams().set('id', id);
    return this.http.delete(this.apiScholarship, { params: param });
  }
  createScholarship(data: any): Observable<BaseResponse<ScholashipResponse>> {
    return this.http.post<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      data
    );
  }
  updateScholarship(data: any): Observable<BaseResponse<ScholashipResponse>> {
    return this.http.put<BaseResponse<ScholashipResponse>>(
      this.apiScholarship,
      data
    );
  }
}
