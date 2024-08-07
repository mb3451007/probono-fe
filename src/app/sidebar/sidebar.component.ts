import { Component, OnInit } from '@angular/core';
import { EventsService } from '../api/events.service';
import { AuthService } from '../api/auth.service';

export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    guest: boolean;
    admin: boolean;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', guest: true, admin: true,    title: 'OVERVIEW',              icon:'nc-bank',       class: '' },
    { path: '/hub', guest: true, admin: true,    title: 'Hub', icon:'nc-planet',       class: '' },
    { path: '/organisations', guest: true,  admin: true,   title: 'Organisations',     icon:'nc-diamond',       class: '' },
    { path: '/volunteers', guest: true, admin: true,    title: 'Volunteers',        icon:'nc-favourite-28',       class: '' },
    { path: '/projects', guest: true, admin: true,    title: 'Projects',        icon:'nc-ambulance',       class: '' },
    { path: '/admin-summary', guest: false,  admin: true,   title: 'Admin Dashboard',        icon:'nc-settings',       class: '' },
//    { path: '/login', guest: true,  admin: false,      title: 'Dashboard Login',    icon:'nc-spaceship',  class: 'active-pro' },
    { path: '/dashboard/logout', guest: false, admin: true,       title: 'Log Out',    icon:'nc-user-run',  class: 'active-pro' },
    { path: '/belts-stars', guest: true,  admin: true,   title: 'Belts & Stars',        icon:'nc-trophy',       class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    user: any;

    constructor (
      private events: EventsService,
      private authService: AuthService
    ) {
      this.menuItems = ROUTES.filter(menuItem => menuItem && menuItem.guest);
    }

    ngOnInit() {
      this.events.user$
      .subscribe((res: any) => {
        if(res) {
          this.user = res;
          this.menuItems = ROUTES.filter(menuItem => menuItem && menuItem.admin);
        } else {
          this.user = null;
          this.menuItems = ROUTES.filter(menuItem => menuItem && menuItem.guest);
        }
      });

      if(!this.user) {
        this.user = this.authService.getData('user');

        if(this.user) {
          this.menuItems = ROUTES.filter(menuItem => menuItem && menuItem.admin);
        }
      }
    }
}
