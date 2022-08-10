import { Injectable } from '@angular/core';

interface enterprice {
  name: string
  id: number
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  public enterprise: enterprice = {
    name: "",
    id: 0
  }
}
