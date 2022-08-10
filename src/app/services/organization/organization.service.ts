import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as components from './components'

interface response<T> {
  code: number
  msg: string
  data: T
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private http: HttpClient
  ) { }

  // endpoint: string = "http://124.222.115.99/organization"
  endpoint: string = "http://localhost/organization"

  insertWorkshop(req: components.InsertWorkshopReq): Observable<components.InsertWorkshopReply> {
    return this.http.post<components.InsertWorkshopReply>(this.endpoint + "/workshop", req)
  }

  updateWorkshopInfo(req: components.UpdateWorkshopInfoReq): Observable<components.UpdateEnterpriseInfoReply> {
    return this.http.patch<components.UpdateWorkshopInfoReply>(this.endpoint + "/workshop", req)
  }

  deleteWorkshop(req: components.DeleteWorkshopReq): Observable<components.DeleteWorkshopReply> {
    return this.http.delete<components.DeleteWorkshopReply>(this.endpoint + "/workshop", {
      params: Object(req)
    })
  }

  getWorkshopList(req: components.GetWorkshopListReq): Observable<components.GetWorkshopListReply> {
    return this.http.get<components.GetWorkshopListReply>(this.endpoint + "/workshop", {
      params: Object(req)
    })
  }

  createEnterprise(req: components.CreateEnterpriseReq): Observable<response<components.CreateEnterpriseReply>> {
    return this.http.post<response<components.CreateEnterpriseReply>>(this.endpoint + "/enterprise", req)
  }

  updateEnterpriseInfo(req: components.UpdateEnterpriseInfoReq): Observable<components.UpdateEnterpriseInfoReply> {
    return this.http.patch<components.UpdateEnterpriseInfoReply>(this.endpoint + "/enterprise", req)
  }

  deleteEnterprise(req: components.DeleteEnterpriseReq): Observable<components.DeleteEnterpriseReply> {
    return this.http.delete<components.DeleteEnterpriseReply>(this.endpoint + "/enterprise", {
      params: Object(req)
    })
  }

  getEnterpriseIdByName(name: string): Observable<response<components.GetEnterpriseIdByNameReply>> {
    return this.http.get<response<components.GetEnterpriseIdByNameReply>>(this.endpoint + "/enterprise", { params: { name: name } })
  }
}
