import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as components from './components'
export * from './components'

@Injectable({
  providedIn: 'root'
})
export class StafferService {

  constructor(
    private http: HttpClient
  ) { }

  endpoint = "http://124.222.115.99/organization"

  login(params: components.LoginReqParams): Observable<components.LoginReply> {
    return this.http.post<components.LoginReply>("/staffer/login", params)
  }

  insertStaffer(req: components.InsertStafferReq): Observable<components.InsertStafferReply> {
    return this.http.post<components.InsertStafferReply>("/staffer", req)
  }


  updateStafferInfo(req: components.UpdateStafferInfoReq): Observable<components.UpdateStafferInfoReply> {
    return this.http.patch<components.UpdateStafferInfoReply>("/staffer", req)
  }

  getStafferListByEnterprise(params: components.GetStafferListByEnterpriseReqParams): Observable<components.GetStafferListByEnterpriseReply> {
    return this.http.get<components.GetStafferListByEnterpriseReply>("/staffer", {
      params: Object(params)
    })
  }

  getStafferListByWorkshop(params: components.GetStafferListByWorkshopReqParams): Observable<components.GetStafferListByWorkshopReply> {
    return this.http.get<components.GetStafferListByWorkshopReply>("/workshop/staffer", {
      params: Object(params)
    })
  }

  updateStafferPassword(params: components.UpdateStafferPasswordReqParams): Observable<components.UpdateStafferPasswordReply> {
    return this.http.put<components.UpdateStafferPasswordReply>("/staffer/password", params)
  }

  resetStafferPassword(params: components.ResetStafferPasswordReqParams): Observable<components.ResetStafferPasswordReply> {
    return this.http.delete<components.ResetStafferPasswordReply>("/staffer/password", {
      params: Object(params)
    })
  }
}
