import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { OrganizationsComponent }           from '../../pages/organizations/organizations.component';

import { LoginComponent }         from '../../pages/login/login.component';
import { AdminComponent }         from '../../pages/admin/admin.component';
import { OrganisationsComponent }         from '../../pages/admin/organisations/organisations.component';
import { VolunteersComponent }         from '../../pages/volunteers/volunteers.component';
import { ProjectsComponent }         from '../../pages/projects/projects.component';

import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent }         from '../../pages/admin/modal/modal.component';
import { FormComponent }         from '../../pages/admin/modal/form/form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule} from 'ngx-pagination';
import { OverduePipe } from '../../pipes/overdue.pipe';
import { GlossaryComponent } from '../../pages/glossary/glossary.component';
import { BeltsComponent } from '../../pages/belts/belts.component';
import { LangPipe } from '../../pipes/lang.pipe';
import { EntityPipe } from '../../pipes/entity.pipe';
import { ContributionPipe } from '../../pipes/contribution.pipe';
import { StringFilterPipe } from '../../pipes/string-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    NgMultiSelectDropDownModule,
    NgxPaginationModule
  ],
  declarations: [
    DashboardComponent,
    OrganizationsComponent,
    LoginComponent,
    AdminComponent,
    OrganisationsComponent,
    GlossaryComponent,
    ModalComponent,
    VolunteersComponent,
    ProjectsComponent,
    FormComponent,
    OverduePipe,
    LangPipe,
    EntityPipe,
    ContributionPipe,
    BeltsComponent,
    StringFilterPipe
  ],
  exports: [ModalComponent]
})

export class AdminLayoutModule {}
