import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(
    private _http: HttpClient
    
  ){}

  getAccessToken(): Observable<any>{

    const body = new URLSearchParams();
    body.set("grant_type", "client_credentials");
    body.set("client_id", "2111b3afabb74627a8e51d834f6363b2");
    body.set("client_secret", "51a6f25d66374194b3063166b06b1990");

    return this._http.post<any>("https://accounts.spotify.com/api/token", body.toString(), {
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

}
