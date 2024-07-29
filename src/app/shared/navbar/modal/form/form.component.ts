import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef  } from '@angular/core';
import { EventsService } from '../../../../api/events.service';
import { AuthService } from '../../../../api/auth.service';
import { MainService } from '../../../../api/main.service';
import * as moment from 'moment';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-modal-form2',
  templateUrl: './form.component.html',
})
export class FormComponentNav implements OnInit{
  @Input() table_name: string = '';
  clientForm: any;
  childData: any;
  formEntries: any[] = [];
  assortedEntries: any[] = [];
  months: any[] = [];
  activeMonth: any = {};
  entry: any = {};
  editStatus: boolean = true;
  activeYear: any;
  years: any = [];
  currentPosition: any;
  expand: boolean = false;
  formEntry: FormGroup;
  user: any;
  showForm: boolean = false;
  @Input() record: any;
  @Input() recordId: any;
  @Input() type: any;
  @Output() formActions = new EventEmitter<string>();
  isLoading: boolean = false;

  constructor(
    public events: EventsService,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    private mainService: MainService,
    public formbuilder: FormBuilder
  ) {
  }

    ngOnInit(): void {
      this.showForm = false;
      this.user = this.authService.getData('user');
      this.loadForm();
      this.ref.markForCheck();
    }

    loadForm() {
      this.formEntry = this.formbuilder.group({
        first_name: [this.record ? this.record.first_name : '', Validators.required],
        last_name: [this.record ? this.record.last_name : '', Validators.required],
        account: [this.record ? this.record.account : this.user.account, Validators.required],
        email: [this.record ? this.record.email : '', Validators.required],
        password: [this.record ? null : '', Validators.required],
        phone: [this.record ? this.record.phone : '', Validators.required],
        user_avatar: [this.record ? this.record.user_avatar : '/', Validators.required],
        permission: [this.record ? this.record.permission : 'staff', Validators.required],
        meta: [this.record ? this.record.meta : '[]', Validators.required],
        status: [this.record ? this.record.status : true, Validators.required]
      });
      this.showForm = true;
    }

    postData(data: any) {
      let cloneData = JSON.parse(JSON.stringify(data));

      if(this.type == 'password') {
        this.changePassword(data);
        return;
      }

      if(this.recordId) {
        // update instead
        for(var key in data) {
          if(!this.record[key]) {
            delete data[key]
          }
        }

        this.updateRecord(data, this.recordId)
        return;
      }

      this.isLoading = true;
      this.mainService.addStaff(this.user, data)
      .subscribe((res: any) => {
        this.events.refreshSubject.next('refresh');
        this.isLoading = false;
        this.formActions.emit('close');
      }, err => {
        this.isLoading = false;
      })
    }

    updateRecord(data, id) {
      data['id'] = id;
      this.isLoading = true;
      this.mainService.updateStaff(this.user, data)
      .subscribe((res: any) => {
        this.events.refreshSubject.next('refresh');
        this.isLoading = false;
        this.formActions.emit('close');
      }, err => {
        this.isLoading = false;
      })
    }

    changePassword(data) {
      this.isLoading = true;
      this.mainService.passwordOveride(this.user, data)
      .subscribe((res: any) => {
        this.events.refreshSubject.next('refresh');
        this.isLoading = false;
        this.formActions.emit('close');
      }, err => {
        this.isLoading = false;
      })
    }
}
