import { Injectable } from '@angular/core';
import { Pais } from '../model/pais';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  private url: string = 'http://localhost:8080/pais'

  constructor( 
    private http: HttpClient
  ) { }

  listar(){
    return this.http.get<Pais[]>(this.url);
  }
}
