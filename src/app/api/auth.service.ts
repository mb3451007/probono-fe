import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Config from '../../constants';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public http: HttpClient
  ) { }

  doLogin(email: string, password: string) {
    return this.http.post(Config.MAIN_URL + 'api/user/auth', {
      username: email,
      password: password
    }); // .map(res => res.json());
  }

  doLoginX(email: string, password: string) {
    let signin = {username: email, password: password};
    let url = "https://www.proz.com/oauth/token/with-login";
    let client_id = "57cd225315e5055ebf82355154c4346d4f60f715";
    let secret_key = "6e9f8e9128920380960f4c601367c35f9480fbf8";
    const token = btoa(`${signin.username}:${signin.password}`);

    // get bearer token
    const requestBody = {
      'client_id': client_id,
      "username": signin.username,
      "password": signin.password,
      'client_secret': secret_key,
      'scope': 'message.send public kudoz.all profile.read profile.write job.quote job.post quickpoll availability wiwo wiwo.post media.post pools.all user.email userlist usernote action.read',
    };

    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + token
    });

    return this.http.post(url, requestBody, {
      headers: httpHeaders,
    });
  }

  getUserInfo() {
    let auth = this.getAuth();
    if(!auth) {
      return of(0);
    }

    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    });

    console.log('user info', auth);
    // return this.http.get(API_URL + 'userinfo', {
    return this.http.get(Config.MAIN_URL + 'api/entity/userinfo', {
      headers: httpHeaders,
    });
  }

  signUp(body:any) {
    return this.http.post(Config.MAIN_URL + 'api/user', body); // main is account
  }

  generateToken(user: any, body: any) {
    let auth = this.getAuth();
    if(!auth) {
      return of(0);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth.access_token}`,
    });

    //let headers = new HttpHeaders()
    //  .set('Authorization', 'Bearer ' + user?.token)

    return this.http.post(Config.REST_URL + 'token',
      body, { headers: headers })
  }

  validateAuthToken(token:string) {
    let header: HttpHeaders = new HttpHeaders();
    header.append('Authorization', 'Bearer ' + token);

    return this.http.post(Config.MAIN_URL + 'api/user/' + token,
      {}, { headers: header })
  }

  setData(key:string, data:any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getData(key:string) {
    let data:any = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  removeData(key:string) {
    localStorage.removeItem(key);
  }

  private getAuth() {
    try {
      const lsValue = localStorage.getItem('authToken');
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  logout() {
    return localStorage.clear();
  }
}
