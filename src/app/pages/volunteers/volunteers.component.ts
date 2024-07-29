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
          console.log('vol', res);
          this.isLoading = false;
          this.entriesVolunteers = this.sortBeltStars(res.entries);
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
        this.entriesVolunteers = this.sortBeltStars(res.entries);
        this.totalItems = res.entries.length;
        this.isSearching = false;
      }, err =>{
        this.isSearching = false;
      })
    }

    sortBeltStars(entries: any[]) {
      for(var i = 0; i < entries.length; i++) {
        entries[i]['points'] = ((entries[i].hours || 0) * 1000) + (entries[i].words || 0);
        entries[i]['belt'] = this.pointsClass(entries[i]['points']);
        entries[i]['star_color'] = this.getStarColor(parseInt(entries[i].stars) || 0);
      }

      return entries;
    }

    pointsClass(points: number) {
      const belts = [
        { points: 0, color: "white" },
        { points: 1000, color: "white" },
        { points: 2500, color: "yellow" },
        { points: 5000, color: "orange" },
        { points: 10000, color: "purple" },
        { points: 15000, color: "blue" },
        { points: 20000, color: "green" },
        { points: 35000, color: "gray" },
        { points: 50000, color: "gold" },
        { points: 75000, color: "brown" },
        { points: 100000, color: "red" },
        { points: 250000, color: "red_black" },
        { points: 500000, color: "black" }
      ];

      for(var i = 0; i < belts.length; i++) {
        if(points >= belts[i].points && points < belts[i + 1]?.points) {
          return belts[i].color;
        }
      }

      return points > 500000 ? "black" : "white";
    }

    getStarColor(stars: number) {
      const starRanges = [
        { range: 20, color: 'white' },
        { range: 40, color: 'yellow' },
        { range: 60, color: 'orange' },
        { range: 80, color: 'purple' },
        { range: 100, color: 'blue' },
        { range: 120, color: 'green' },
        { range: 140, color: 'gray' },
        { range: 160, color: 'gold' },
        { range: 180, color: 'brown' },
        { range: 200, color: 'red' },
        { range: 220, color: 'red_black' },
        { range: 221, color: 'black' }
      ];

      for(var i = 0; i < starRanges.length; i++) {
        if(stars <= starRanges[i].range) { //  && points < belts[i + 1]?.points
          return starRanges[i].color;
        }
      }

      return stars > 220 ? "black" : "white";
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

      if(this.sortType === 'stars') {
        this.sortField = 'stars';
      }

      await this.fetchEntries('volunteers');
      this.isSearching = false;
    }
}
