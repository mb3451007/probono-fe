import { Component, Input, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MainService } from '../../../api/main.service';
import { EventsService } from '../../../api/events.service';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnInit{
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>;
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
    container: '#cover-modal',
    ariaLabelledBy: 'settings-content',
    animation: true,
    centered: true,
    size: 'lg'
  };

  constructor(
    private modalService: NgbModal,
    private mainService: MainService,
    private route: ActivatedRoute,
    public events: EventsService
  ) {
  }

  ngOnInit() {
    
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.showForm = false;
      let element = document.getElementById('cover-modal');
      this.modalOptions.container = <HTMLElement>element;
      this.modalRef = this.modalService.open(this.modalContent, this.modalOptions);
      this.modalRef.result.then(resolve, resolve);
    });
  }

  formUpdates(ev: any) {

    if(ev === 'close') {
      this.close();
    }
  }

  modalDismissed() {
    this.modalConfig.loadEntries = false;
    this.showForm = false;
  }

  deleteEntry(entry: any) {

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
