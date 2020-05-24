import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PizzaTableService {

  constructor(private http: HttpClient) {}

  getPizzaData() {
    return this.http.get('https://my-json-server.typicode.com/ahmerrkhanzz/pizza-app/db');
  }
}
