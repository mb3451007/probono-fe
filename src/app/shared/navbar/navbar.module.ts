import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';

import { ModalComponentNav }         from './modal/modal.component';
import { FormComponentNav }         from './modal/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [ RouterModule, CommonModule, NgbModule, NgbModalModule, NgxPaginationModule, FormsModule, ReactiveFormsModule],
    declarations: [ NavbarComponent, ModalComponentNav, FormComponentNav ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}
