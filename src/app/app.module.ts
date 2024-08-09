import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import { TimeSincePipe } from './pipes/time-since.pipe';
import { CommonModule } from "@angular/common";
import { HubComponent } from "./pages/hub/hub.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChatComponent } from "./pages/chat/chat.component";


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    TimeSincePipe,
    HubComponent,
    ChatComponent

//    OverduePipe
  ],
  imports: [
    BrowserAnimationsModule,
    NgbModule,
    RouterModule.forRoot(AppRoutes,{
      useHash: false
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    CommonModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
