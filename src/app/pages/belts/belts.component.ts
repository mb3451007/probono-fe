import { Component, OnInit } from '@angular/core';
import { MainService } from '../../api/main.service';
import * as moment from 'moment';

@Component({
    selector: 'belts-cmp',
    moduleId: module.id,
    templateUrl: 'belts.component.html'
})

export class BeltsComponent implements OnInit{

    constructor(
      public mainService: MainService
    ) {

    }

    ngOnInit(){
    }
}
