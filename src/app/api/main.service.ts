import { Injectable } from '@angular/core';
import * as Config from '../../constants';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import Swal from 'sweetalert2';
const NODE_API = "https://nodeapi.proz.com/";

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    public http: HttpClient
  ) { }

  // get 1
  get(user:any, table: string, entryId:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(Config.REST_URL + "entry/" + entryId + '/?table_name=' + table, { headers: headers })
    //  .pipe(map(res => this.parseData(res, 'entry')));
  }

  getStaff(user:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(Config.MAIN_URL + 'api/account/users', { headers: headers })
    .pipe(map(res => this.parseStaff(res, 'data', true)));

  }

  getEntity(entity_id: any) {
    // get saved Token ID
    let auth = this.getAuth();

    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`
    });

    return this.http.get(NODE_API + 'api/entity?id=' + entity_id, {
      headers: httpHeaders
    });
  }

  addStaff(user:any, body:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    let bodyFinal = this.parseStaff(body, 'data', false);
    return this.http.post(Config.MAIN_URL + 'api/staff', bodyFinal, { headers: headers })
  }

  updateStaff(user:any, body:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    let bodyFinal = this.parseStaff(body, 'data', false);
    return this.http.patch(Config.MAIN_URL + 'api/user', bodyFinal, { headers: headers })
  }

  updatePassword(user:any, body:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.patch(Config.MAIN_URL + 'api/user/password', body, { headers: headers })
  }

  passwordOveride(user:any, body:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.patch(Config.MAIN_URL + 'api/user/passwordadmin', body, { headers: headers })
  }

  deleteStaff(user:any, id:any) { //id, table:string, entry_id
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.delete(Config.MAIN_URL + "api/user?id=" + id, { headers: headers });
  }

  uploadFile(user:any, file:any, filename:string): Promise<any> {
    return new Promise((resolve, reject) => {
      let auth = this.getAuth();

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${auth?.access_token}`,
      });

      let formData = new FormData();
      formData.append('file', file, filename);

      this.http.post(Config.REST_URL + 'uploadfile', formData, { headers: headers })
        .subscribe((data: any) => {
          let resourceURL = 'https://api.prozprobonostats.com' + data.url;
          resolve(resourceURL);
        }, err => {
          reject(err);
      });
    });
  }

  analizeLinguists(user, data) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(Config.REST_URL + 'analize-linguists?selectors=' + JSON.stringify(data), { headers: headers })
  }

  submitForm(user:any, body:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    if (body.date_created == undefined || body.date_created == '') {
      body.date_created = moment().format('YYYY-MM-DD hh:mm:ss');
      body.date_updated = moment().format('YYYY-MM-DD hh:mm:ss');
    } else {
      body.date_created = moment(body.date_created).format('YYYY-MM-DD');
    }

    let bodyFinal = this.parseObject(body, false);
    return this.http.post(Config.MAIN_URL + "api/v1/entry/", bodyFinal, { headers: headers })
    .pipe(map(res => this.parseData(res, 'entry')));
  }

  search(user:any, table:string, key:string, searchstring:string, paging: any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    let page = 1;
    return this.http.get(
      Config.REST_URL
      + 'search?table=' + table + '&key=' + key + '&searchstring=' + searchstring + '&page=' + page + '&paging=' + paging, { headers: headers })
  //    .pipe(map(res => res));
      .pipe(map(res => this.parseData(res, 'entries')));
  }

  searchSelectors(user:any, table:string, key:string, searchstring:string, selectors:any, date:any, count:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(
      Config.REST_URL
      + 'searchMore?table_name=' + table + '&key=' + key + '&searchstring=' + searchstring + '&selectors=' + selectors + '&date=' + date + '&count=' + count, { headers: headers })
      .pipe(map(res => this.parseData(res, 'entries')));
  }

  updateEntry(user:any, body:any, entryId:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    let bodyFinal = this.parseObject(body, false);
    console.log('edit data', bodyFinal);
    return this.http.put(Config.REST_URL + "entry/" + entryId, bodyFinal, { headers: headers })
      .pipe(map(res => this.parseData(res, 'entry')));
  }

  getEntries(user:any, table:string, paging:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(
      Config.REST_URL
      + 'entries?table_name=' + table + '&paging=' + paging, { headers: headers })
      .pipe(map(res => this.parseData(res, 'entries')));
  }

  getMetrics(user:any, table:string, selectors:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(
      Config.MAIN_URL
      + 'api/metrics/items?table=' + table + '&selectors=' + selectors, { headers: headers })
      .pipe(map(res => res));
  }

  getUpEventsMetrics(user:any, table:string, selectors:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(
      Config.MAIN_URL
      + 'api/metrics/upcomingevents?table=' + table + '&selectors=' + selectors, { headers: headers })
      .pipe(map(res => res));
  }

  getGroupsMetricsData(user:any, table:string, selectors:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(
      Config.MAIN_URL
      + 'api/metrics/ytdgraphdata?table=' + table + '&selectors=' + selectors, { headers: headers })
      .pipe(map(res => res));
  }

  getEntriesBySelectors(user:any, table:string, selectors:any, paging:any, page: any, field: any, sort: any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(
      Config.REST_URL
      + 'getbyselectors?table_name=' + table + '&selectors=' + selectors + '&page=' + page + '&paging=' + paging + '&field=' + field + '&sort=' + sort, { headers: headers })
    //  .pipe(map(res => res)); // this.parseData(res, 'entries')
      .pipe(map(res => this.parseData(res, 'entries')));
  }

  getFormData(token:string, id:any, table:string) { //id, table:string, entry_id
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.get(Config.REST_URL + "form/" + id + '?table=' + table, { headers: headers })
    .pipe(map(res => this.parseData(res, 'entry')));
  }

  updateFormData(token:string, body:any, id:any) { //id, table:string, entry_id
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    let bodyFinal = this.parseObject(body, false);
    return this.http.put(Config.REST_URL + "form/" + id, bodyFinal, { headers: headers })
    .pipe(map(res => this.parseData(res, 'entry')));
  }

  deleteRecord(user:any, id:any, table:string) { //id, table:string, entry_id
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.delete(Config.REST_URL + "entry/" + id + '?table_name=' + table, { headers: headers });
  }

  deleteRecordsBySelectors(user:any, selectors:any, table:string, entry_id:any) { //id, table:string, entry_id
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.delete(Config.REST_URL + 'deleteBySelectors?table_name=' + table + '&entry_id=' + entry_id + '&selectors=' + selectors, { headers: headers });
  }

  sendEmail(user:any, body:any) {
    let auth = this.getAuth();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${auth?.access_token}`,
    });

    return this.http.post(Config.REST_URL + 'sendemail', body, { headers: headers })
    .pipe(map(res => res));
  }

  upload(user:any, file:any): Promise<any> {
    return new Promise((resolve, reject) => {
      let auth = this.getAuth();

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${auth?.access_token}`,
      });

      let formData = new FormData();
      formData.append('file', file);

      this.http.post(Config.REST_URL + 'uploadfile', formData, { headers: headers })
        .subscribe((data: any) => {
          resolve(data);
        }, err => {
          reject(err);
      });
    });
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

  parseData(data:any, type:string) {
    let parsedData = [];

    if(!data || !data[type]?.length) {
      return [];
    }

    for(var i = 0; i < data[type].length; i++) {
      let parsRec = this.parseObject(data[type][i], true);
      parsedData.push(parsRec);
    }

    // order
    parsedData = parsedData.sort((a, b) => a.order - b.order);

    return {...data, [type]: parsedData};
  }

  parseObject(values:any, status:any) {
    if(!values || !values.table_name) {
      return values;
    }
    let arrayItems = this.getArrayItems(values.table_name); // based on table

    for(var i = 0; i < arrayItems.length; i++) {
      values[arrayItems[i]] = status ? JSON.parse(values[arrayItems[i]]) : JSON.stringify(values[arrayItems[i]]);
    }

    return values;
  }

  parseStaff(data:any, type:string, status: boolean) { // true is Parse
    let parsedData = [];

    if(status === true) {
      for(var i = 0; i < data[type].length; i++) {
          data[type][i]['meta'] = JSON.parse(data[type][i]['meta']);
          parsedData.push(data[type][i]);
      }
    } else {
      data['meta'] = JSON.stringify(data['meta']);
    }

    return status === true ? {[type]: parsedData} : data;
  }

  getArrayItems(table:string) {
    let items:any[] = [];

    if(table === 'organisations' || table === 'projects') {
      items = ["volunteers"];
    }

    if(table === 'volunteers') {
      items = ["secondary_languages"];
    }

    if(table === 'alerts') {
      items = ["meta", "viewed"];
    }

    return items;
  }


  // alert management
  showAlert(title:string, message:string, type:string) {
    if(type === 'success') {
      return this.presentAlertSuccess(title, message);
    }

    if(type === 'success-confirm') {
      return this.presentAlertSuccessConfirm(title, message);
    }

    if(type === 'error') {
      return this.presentAlertError(title, message);
    }

    if(type === 'delete') {
      return this.presentAlertDelete(title, message);
    }

    if(type === 'load') {
      return this.presentAlertLoader(title, message);
    }

    if(type === 'warning') {
      return this.presentAlertWarning(title, message);
    }

    return this.presentAlertNormal(title, message);
  }

  showToast(title: string, message: string, type: string) {
    if (type == "success") {
      // this.toastr.success(message, title);
    } else if (type == "error") {
      // this.toastr.error(message, title);
    }
  }

  presentAlertSuccess(title:string, message:string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: 'Understood'
    //  timer: 1500
    })
  }

  presentAlertSuccessConfirm(title:string, message:string) {
    let rec = Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: 'Open places',
      showCancelButton: true,
    //  timer: 1500
  });

  return rec;
  }

  presentAlertError(title:string, message:string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      showConfirmButton: true,
      confirmButtonText: 'Understood'
    })
  }

  presentAlertWarning(title:string, message:string) {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: 'Okay'
    })
  }

  presentAlertDelete(title:string, message:string) {
      let rec = Swal.fire({
        title: title,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Delete'
    });

    return rec;
  }

  presentAlertNormal(title:string, message:string) {
    return Swal.fire({
      title: title,
      text: message,
      showConfirmButton: true,
      confirmButtonText: 'Understood'
    //  timer: 1500
    })
  }

  presentAlertLoader(title:string, message:string) {
    let buttonToReplace: HTMLButtonElement;
    Swal.fire({
      title: title,
      text: message,
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(buttonToReplace)
      }
    });
  }

  close() {
    Swal.close();
  }

  confirmBox(){
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this Event!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  }

  uploadForm(data:any):any{
   return this.http.post(Config.REST_URL + 'uploadform' , data )
  }

  uploadFiles( data:any):any{
   return this.http.post(Config.REST_URL + 'uploadfiles' ,  data )
  }
  saveFile( data:any):any{
   return this.http.post(Config.REST_URL + 'savefiles' ,  data )
  }
}
