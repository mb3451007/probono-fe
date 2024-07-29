import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { OrganizationsComponent } from '../../pages/organizations/organizations.component';
import { VolunteersComponent } from '../../pages/volunteers/volunteers.component';
import { ProjectsComponent } from '../../pages/projects/projects.component';
import { LoginComponent } from '../../pages/login/login.component';
import { AdminComponent } from '../../pages/admin/admin.component';
import { GlossaryComponent } from '../../pages/glossary/glossary.component';
import { BeltsComponent } from '../../pages/belts/belts.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'dashboard/:action',      component: DashboardComponent },
    { path: 'volunteers',           component: VolunteersComponent },
    { path: 'projects',           component: ProjectsComponent },
    { path: 'organisations',          component: OrganizationsComponent },
    { path: 'glossary',          component: GlossaryComponent },
    { path: 'glossary/:id',          component: GlossaryComponent },
    { path: 'login',          component: LoginComponent },
    { path: 'belts-stars',          component: BeltsComponent },
    { path: 'admin-summary',  component: AdminComponent },
    { path: 'admin-summary/:page',  component: AdminComponent }
];