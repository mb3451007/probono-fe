import { Component, OnInit } from '@angular/core';
import { MainService } from '../../api/main.service';
import * as moment from 'moment';

@Component({
    selector: 'volunteers-cmp',
    moduleId: module.id,
    templateUrl: 'volunteers.component.html'
})

export class VolunteersComponent implements OnInit{
    public entriesVolunteers: any[] = [];
    isLoading: boolean = false;
    user: any = {token: 'none'};
    error: any;
    page: number = 1;
    itemsPerPage = 250;
    totalItems: any;
    isSearching: boolean = false;
    sortType: string = '';
    sortMode: string = 'asc';
    sortField: string = 'volunteers.first_name';

    constructor(
      public mainService: MainService
    ) {

    }

    ngOnInit(){
      this.fetchEntries('volunteers')
    }

    async loadPage(ev) {
      this.isSearching = true;
      this.page = ev;
      await this.fetchEntries('volunteers');
      this.isSearching = false;
    }

    fetchEntries(table: string): Promise<any[]> {
      this.isLoading = true;
      return new Promise<any[]>((resolve, reject) => {
        this.mainService.getEntriesBySelectors(this.user, table, JSON.stringify({'volunteers.status': 'active'}), this.itemsPerPage, this.page, this.sortField, this.sortMode)
        .subscribe((res: any) => {
          this.isLoading = false;
          this.entriesVolunteers = res.entries;
          this.totalItems = res.entries.length;
          resolve(this.entriesVolunteers);
        }, err => {
          this.error = err;
          this.isLoading = false;
          this.isSearching = false;
          reject(err);
        })
      })
    }


    async setPerPage(number) {
      this.isSearching = true;
      this.itemsPerPage = number;
      this.page = 1;
      //reload
      await this.fetchEntries('volunteers');
      this.isSearching = false;
    }

    searchFor(ev) {
      let string = ev.target.value;
      this.search('volunteers', string);
    }

    search(table, searchstring) {
      let key = 'first_name';
      this.isSearching = true;
      this.mainService.search(this.user, table, key, searchstring, this.itemsPerPage)
      .subscribe((res: any) => {
        this.entriesVolunteers = res.entries
        this.totalItems = res.entries.length;
        this.isSearching = false;
      }, err =>{
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
        this.sortField = 'volunteers.first_name';
      }

      if(this.sortType === 'words') {
        this.sortField = 'words';
      }

      await this.fetchEntries('volunteers');
      this.isSearching = false;
    }
}
