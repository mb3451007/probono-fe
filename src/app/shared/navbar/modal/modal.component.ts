import { Component, Input, TemplateRef, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalConfig } from './modal.config';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../../api/main.service';
import { AuthService } from '../../../api/auth.service';
import { EventsService } from '../../../api/events.service';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-modal-nav',
  templateUrl: './modal.component.html',
})
export class ModalComponentNav implements OnInit{
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ModalComponentNav>;
  private modalRef: NgbModalRef;
  isLoading: boolean = false;
  httpError: any;
  entries: any[] = [];
  client: any;
  chosenId: any = 'null';
  showForm: boolean = false;
  model: string = '';
  clientForm: any;
  currentSelection: any;
  dropdownSettingsSingle:IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'last_name',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  modalOptions:NgbModalOptions = {
    animation: true,
    size: 'lg'
  };
  allUsers: any[] = [];
  user;
  error: any
  page = 1;
  itemsPerPage = 10;
  table: string = 'users';
  record;
  type: string = 'new';
  showUserForm: boolean = false;

  constructor(
    private modalService: NgbModal,
    private mainService: MainService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public events: EventsService,
    public ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getData('user');
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.showForm = false;
      this.modalRef = this.modalService.open(this.modalContent, this.modalOptions);
      this.modalRef.result.then(resolve, resolve);
      this.loadUsers();
    });
  }

  formUpdates(ev: any) {
    if(ev === 'close') {
      this.goBack();
    }

    if(ev === 'reload') {
      this.loadUsers();
    }
  }

  loadUsers(){
    if(!this.user) {
      this.user = this.authService.getData('user');
    }
    this.isLoading = true;
    return new Promise<any[]>((resolve, reject) => {
      this.mainService.getStaff(this.user)
      .subscribe((res: any) => {
        this.allUsers = res.data;
        this.isLoading = false;
        this.ref.markForCheck();
        resolve(this.entries);
      }, err => {
        this.error = err;
        this.isLoading = false;
        reject(err);
      })
    })
  }

  addUser() {
    // form
    this.type = 'new';
    this.showUserForm = true;
  }

  editRecord(rec) {
    this.record = rec;
    this.type = 'edit';
    this.showUserForm = true;
  }

  changePassword(rec) {
    this.record = rec;
    this.type = 'password';
    this.showUserForm = true;
  }

  goBack() {
    this.showUserForm = false;
    this.loadUsers();
  }

  modalDismissed() {
    this.showForm = false;
  }

  removeRecord(ent) {
    if(confirm("Do you really want to delete " + ent.first_name + "?")) {
      this.delRecord(ent);
    }
  }

  delRecord(user: any) {
    this.allUsers = this.allUsers.filter(rec => rec.id !== user.id);
    this.mainService.deleteStaff(this.user, user.id)
    .subscribe((rec: any) => {
      this.loadUsers();
    }, err =>{
      this.loadUsers();
    })
  }

  viewEntry(entry: any) {

  }

  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
      this.modalDismissed();
    }
  }

  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      this.modalDismissed();
      return;
    }

    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
      this.modalDismissed();
    }
  }


}
