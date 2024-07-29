import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MainService } from '../../api/main.service';
import * as moment from 'moment';

@Component({
    selector: 'projects-data-cmp',
    moduleId: module.id,
    templateUrl: 'projects.component.html'
})

export class ProjectsComponent implements OnInit{
    entriesProjects: any[] = [];
    isLoading: boolean = false;
    user: any = {token: 'none'};
    error: any;
    page: number = 1;
    itemsPerPage = 250;
    totalItems: any;
    isSearching: boolean = false;
    sortType: string = '';
    sortMode: string = 'asc';
    sortField: string = 'projects.due';
    projectsStatus: string = 'In Progress';
    filter: string = "";

    constructor(
      public mainService: MainService,
      public ref: ChangeDetectorRef
    ) {

    }

    ngOnInit(){
      this.fetchEntries('projects')
    }

    async loadPage(ev) {
      this.isSearching = true;
      this.page = ev;
      await this.fetchEntries('projects');
      this.isSearching = false;
    }

    fetchEntries(table: string): Promise<any[]> {
      this.isLoading = true;
      let selector = this.projectsStatus === '' ? {} : {'projects.progress': this.projectsStatus};

      return new Promise<any[]>((resolve, reject) => {
        this.mainService.getEntriesBySelectors(this.user, table, JSON.stringify(selector), 5000, this.page, this.sortField, this.sortMode)
        .subscribe((res: any) => {
          this.isLoading = false;
          this.entriesProjects = res.entries;
          this.totalItems = res.total_count;

          /*
          let overdue = {
              "id": 160,
              "progress": "In Progress",
              "table_name": "projects",
              "task": "Book translation",
              "organisation_id": "19",
              "organisation": "Choosing Earth",
              "language_to": "English",
              "language_code_to": "en",
              "due": "2023-06-18T07:00:00.000Z",
              "volunteers": "[268]",
              "volunteerData": [
                  {
                      "id": 268,
                      "first_name": "Langwords Team",
                      "last_name": ""
                  }
              ]
          };
          this.entriesProjects.push(overdue);
          this.entriesProjects.reverse();
          */
          this.ref.markForCheck();
          resolve(this.entriesProjects);
        }, err => {
          this.error = err;
          this.isLoading = false;
          reject(err);
        })
      })
    }

    async setPerPage(number) {
      this.isSearching = true;
      this.itemsPerPage = number;
      this.page = 1;

      //reload
      await this.fetchEntries('projects');
      this.isSearching = false;
    }

    searchFor(ev) {
      let string = ev.target.value;
      this.search('projects', string);
    }

    search(table, searchstring) {
      let key = 'task';
      this.isSearching = true;
      this.mainService.search(this.user, table, key, searchstring, 5000)
      .subscribe((res: any) => {
        this.entriesProjects = res.entries;
        this.totalItems = res.entries.length;
        this.isSearching = false;
      }, err => {
        this.isSearching = false;
      })
    }

    async sortData(type) {
      this.isSearching = true;
      this.sortType = type;
      if(this.sortMode === '' || this.sortMode === 'desc') {
        this.sortMode = 'asc';
      } else if(this.sortMode === 'asc') {
        this.sortMode = 'desc';
      }

      if(this.sortType === 'name') {
        this.sortField = 'projects.organisation_id';
      }

      if(this.sortType === 'words') {
        this.sortField = 'words';
      }

      await this.fetchEntries('projects');
      this.isSearching = false;
    }

    async setProjectsStatus(status) {
      this.isSearching = true;
      this.projectsStatus = status;
      this.page = 1;

      //reload
      await this.fetchEntries('projects');
      this.isSearching = false;
    }
}
