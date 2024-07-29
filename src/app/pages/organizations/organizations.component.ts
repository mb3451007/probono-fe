import { Component, OnInit } from '@angular/core';
import { MainService } from '../../api/main.service';
import * as moment from 'moment';

@Component({
    selector: 'organizations-cmp',
    moduleId: module.id,
    templateUrl: 'organizations.component.html'
})

export class OrganizationsComponent implements OnInit{
    public entriesOrganisations: any[] = [];
    isLoading: boolean = false;
    user: any = {token: 'none'};
    error: any;
    page: number = 1;
    itemsPerPage = 250;
    totalItems: any;
    isSearching: boolean = false;
    sortType: string = '';
    sortMode: string = 'asc';
    sortField: string = 'organisations.name';

    constructor(
      public mainService: MainService
    ) {

    }

    ngOnInit(){
      this.fetchEntries('organisations')
    }

    async loadPage(ev) {
      this.isSearching = true;
      this.page = ev;
      await this.fetchEntries('organisations');
      this.isSearching = false;
    }

    fetchEntries(table: string): Promise<any[]> {
      this.isLoading = true;
      return new Promise<any[]>((resolve, reject) => {
        this.mainService.getEntriesBySelectors(this.user, table, JSON.stringify({'organisations.status': 'active'}), this.itemsPerPage, this.page, this.sortField, this.sortMode)
        .subscribe((res: any) => {
          this.isLoading = false;
          this.entriesOrganisations = res.entries;
          this.totalItems = res.total_count;
          resolve(this.entriesOrganisations);
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
      await this.fetchEntries('organisations');
      this.isSearching = false;
    }

    searchFor(ev) {
      let string = ev.target.value;
      this.search('organisations', string);
    }

    search(table, searchstring) {
      let key = 'name';
      this.isSearching = true;
      this.mainService.search(this.user, table, key, searchstring, this.itemsPerPage)
      .subscribe((res: any) => {
        this.entriesOrganisations = res.entries;
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
        this.sortField = 'organisations.name';
      }

      if(this.sortType === 'words') {
        this.sortField = 'words';
      }

      await this.fetchEntries('organisations');
      this.isSearching = false;
    }
}
