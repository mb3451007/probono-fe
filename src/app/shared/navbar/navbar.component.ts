import { Component, OnInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ROUTES } from '../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { EventsService } from '../../api/events.service';
import { AuthService } from '../../api/auth.service';
import { ModalConfig } from '../../pages/admin/modal.config';
import { ModalComponent } from '../../pages/admin/modal/modal.component';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit{
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    public isCollapsed = true;
    @ViewChild("navbar-cmp", {static: false}) button;
    user: any;
    adminMenu: boolean;
    @ViewChild('modal') private modalComponent: ModalComponent;
    modalConfig: ModalConfig = {
      modalTitle: 'Add User',
      table: '',
      id: '',
      type: 'new',
      record: '',
      loadEntries: false,
      dismissButtonLabel: 'Submit',
      closeButtonLabel: 'Exit',
      animation: true,
      centered: false
    };
    adminMenuLive: string;

    constructor(
      location:Location,
      private renderer : Renderer2,
      private element : ElementRef,
      private router: Router,
      public events: EventsService,
      public authService: AuthService,
      public ref: ChangeDetectorRef
    ) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.user = this.authService.getData('user');
    }

    ngOnInit(){
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        this.router.events.subscribe((event) => {
          this.sidebarClose();
       });

       this.events.user$
         .subscribe((res: any) => {
           if(res) {
             this.user = res;
             this.showAdminMenu();
             this.ref.markForCheck();
           } else {
             this.user = null;
             this.adminMenu = false;
             this.adminMenuLive = 'no';
             this.ref.markForCheck();
           }
         })

       if(!this.user) {
         this.user = this.authService.getData('user');

         if(!this.user) {
           this.user = null;
           this.adminMenu = false;
           this.adminMenuLive = 'no';
           this.ref.markForCheck();
           return;
         }
       }

       this.showAdminMenu();
    }

    showAdminMenu() {
      this.adminMenu = true;
      this.adminMenuLive = 'yes';
      this.ref.markForCheck();
    }


    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 1 );
      }
      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
      }
      sidebarOpen() {
          const toggleButton = this.toggleButton;
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          setTimeout(function(){
              toggleButton.classList.add('toggled');
          }, 500);

          html.classList.add('nav-open');
          if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
          }
          this.sidebarVisible = true;
      };
      sidebarClose() {
          const html = document.getElementsByTagName('html')[0];
          const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
          if (window.innerWidth < 991) {
            setTimeout(function(){
              mainPanel.style.position = '';
            }, 500);
          }
          this.toggleButton.classList.remove('toggled');
          this.sidebarVisible = false;
          html.classList.remove('nav-open');
      };
      collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          //navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }

      }

  openUserModal() {
    if(!this.user) {
      this.user = this.authService.getData('user');
     }
    this.modalConfig.table = 'user';
    this.modalConfig.record = this.user;
    this.modalConfig.type = 'new';
    this.openModal();
  }

  async openModal() {
    return await this.modalComponent.open();
  }
}
