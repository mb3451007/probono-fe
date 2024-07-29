import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { AuthService } from '../../api/auth.service';
import { MainService } from '../../api/main.service';
import { Router } from '@angular/router';

@Component({
    selector: 'login-cmp',
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  showForm: boolean = false;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private mainService: MainService,
    public router: Router
  ) {
  }

  ngOnInit(){
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: ['']
    });
    this.showForm = true;

    this.user = this.authService.getData('user');
    if(this.user) {
      this.router.navigate(['/admin-summary']);
    }
  }

  login(data: any) {
    this.mainService.showAlert('Logging you in', 'Please wait...', 'load');
    this.authService.doLogin(data.email, data.password)
    .subscribe((res: any) => {
      this.mainService.close();
      res['access_token'] = res.token;
      this.authService.setData('authToken', res);

      this.user = res;
      this.authService.setData('user', res);
      this.router.navigate(['/admin-summary']);
    }, (err: any) => {
      this.mainService.close();
      console.log('failed to log in', err);
      this.mainService.showAlert('Logging in failed!', err ? err.error.message : 'Check your internet try again later.', 'error');
    })
  } 

  loginX(data: any) {
    console.log('data', data);
    this.mainService.showAlert('Logging you in', 'Please wait...', 'load');
    this.authService.doLogin(data.email, data.password)
    .subscribe((res: any) => {
      this.authService.setData('authToken', res);
      this.authService.getUserInfo()
      .subscribe((user: any) => {
        let id = Number(user.profile.split("/").pop());
        this.user = {...user, ...res, id: id};
        console.log('user', this.user);
        this.authService.setData('authToken', {...res, id: id});
        this.authService.setData('user', this.user);
        this.mainService.close();
        this.router.navigate(['/admin-summary']);
      }, (err: any) => {
        console.log('err', err);
        this.mainService.close();
        this.mainService.showAlert('Logging in failed!', err ? err.error.message : 'Check your internet try again later.', 'error');
      })
    }, (err: any) => {
      this.mainService.close();
      console.log('failed to log in', err);
      this.mainService.showAlert('Logging in failed!', err ? err.error.message : 'Check your internet try again later.', 'error');
    })
  }

  register(data: any) {
    /*
    let body = {
      first_name: 'Mato',
      last_name: 'Philip',
      email: 'mato@gmail.com',
      phone: '+1',
      password: 'proz1632!',
      account: 'main',
      permission: 'admin',
      status: true,
      user_avatar: '/',
      meta: "[]"
    }
    */
    this.authService.signUp(data)
    .subscribe((res: any) => {
      console.log('signed up', res);
    }, (err: any) => {
      console.log('failed to signup', err);
    })
  }

  forgotPassword() {
    console.log('password');
  }
}
