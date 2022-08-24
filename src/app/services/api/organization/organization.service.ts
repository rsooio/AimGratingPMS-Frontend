import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response, Endpoint } from '@/services/api/apiutils'

import * as components from './components'

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(
    private http: HttpClient
  ) { }

  insertWorkshop(req: components.InsertWorkshopReq): Observable<components.InsertWorkshopReply> {
    return this.http.post<components.InsertWorkshopReply>(Endpoint.Organization + "/workshop", req)
  }

  updateWorkshopInfo(req: components.UpdateWorkshopInfoReq): Observable<components.UpdateEnterpriseInfoReply> {
    return this.http.patch<components.UpdateWorkshopInfoReply>(Endpoint.Organization + "/workshop", req)
  }

  deleteWorkshop(req: components.DeleteWorkshopReq): Observable<components.DeleteWorkshopReply> {
    return this.http.delete<components.DeleteWorkshopReply>(Endpoint.Organization + "/workshop", {
      params: Object(req)
    })
  }

  getWorkshopList(req: components.GetWorkshopListReq): Observable<components.GetWorkshopListReply> {
    return this.http.get<components.GetWorkshopListReply>(Endpoint.Organization + "/workshop", {
      params: Object(req)
    })
  }

  createEnterprise(req: components.CreateEnterpriseReq): Observable<Response<components.CreateEnterpriseReply>> {
    return this.http.post<Response<components.CreateEnterpriseReply>>(Endpoint.Organization + "/enterprise", req)
  }

  updateEnterpriseInfo(req: components.UpdateEnterpriseInfoReq): Observable<components.UpdateEnterpriseInfoReply> {
    return this.http.patch<components.UpdateEnterpriseInfoReply>(Endpoint.Organization + "/enterprise", req)
  }

  deleteEnterprise(req: components.DeleteEnterpriseReq): Observable<components.DeleteEnterpriseReply> {
    return this.http.delete<components.DeleteEnterpriseReply>(Endpoint.Organization + "/enterprise", {
      params: Object(req)
    })
  }

  getEnterpriseIdByName(name: string): Observable<Response<components.GetEnterpriseIdByNameReply>> {
    return this.http.get<Response<components.GetEnterpriseIdByNameReply>>(Endpoint.Organization + "/enterprise", { params: { name: name } })
  }
}
