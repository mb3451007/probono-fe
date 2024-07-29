import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../../api/events.service';
import { AuthService } from '../../api/auth.service';
import { MainService } from '../../api/main.service';
import { CATEGORIES } from '../../../constants';
import * as moment from 'moment';

@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

  public canvas : any;
  public ctx;
  public chartColor;
  public chartLanguages;
  public chartHours;
  public numberWords;
  public numberOrganisations;
  public numberVolunteers;
  public numberHours;
  public ytdWords: any[] = [];
  public ytdLanguages: any[] = [];
  public ytdCategories: any[] = [];
  public weekInFocusData: any[] = [];
  public categories: any[] = CATEGORIES;
  public categoriesData: any = {};
  public user = {token: 'none'};
  public year = moment().format("YYYY");
  public pieColors: any[] = [
    '#008471', //4acccd
    '#e3e3e3',
    '#fcc468',
    '#ef8157',
    '#007bff',
    '#28a745',
    '#51bcda',
    '#dc3545',
    '#000000',
    '#ef8157',
    '#9a9a9a'
  ];
  graphsLoaded: boolean = false;
  weekNumbers: any = {};
  weekColors: any = {};

  constructor(
    public route: ActivatedRoute,
    private authService: AuthService,
    private events: EventsService,
    public mainService: MainService
  ) {
    this.route.params.subscribe(params => {
      if(params.action === 'logout') {
        this.authService.logout();
        this.events.userSubject.next(null);
      }
    })
  }
    ngOnInit(){
      this.loadPageData();
      this.chartColor = "#FFFFFF";
    }

    loadPageData() {
      this.loadMetrics('organisations');
      this.loadMetrics('volunteers');
      this.loadMetrics('words');
      this.loadMetrics('hours');
    //  this.loadMetricsYTD('words');
    //   this.loadMetricsYTD('languages');

      // categories
      this.categoriesData = {};
      this.ytdCategories = [];
      this.categories.forEach((cat: any) => {
        this.loadCategoryMetrics(cat.value, cat.label);
      });

      // week in focus
      this.weekInFocusData = [];
      this.graphsLoaded = false;
      ['words', 'hours', 'organisations', 'volunteers'].forEach(rec => {
        this.loadWeekMetrics(rec);
      });
    }

    loadMetrics(table) {
      this.mainService.getMetrics(this.user, table, JSON.stringify({status: 'active'}))
      .subscribe((res: any) => {
        if(table === 'words')         this.numberWords          = res.data;
        if(table === 'organisations') this.numberOrganisations  = res.data;
        if(table === 'volunteers')    this.numberVolunteers     = res.data;
        if(table === 'hours')         this.numberHours          = res.data;
      })
    }

    loadWeekMetrics(rec: string) {
      const sevenDaysAgo = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss');
      const apiRequest = {
      //  status: 'active',
        date_start: sevenDaysAgo
      };
      this.mainService.getMetrics(this.user, rec, JSON.stringify(apiRequest))
      .subscribe((res: any) => {
        this.weekNumbers[rec] = res.data;
        this.weekInFocusData.push({table: rec, value: res.data});
        this.loadBarGraphs();
      })
    }

    loadCategoryMetrics(cat: string, label: string) {
      this.mainService.getMetrics(this.user, 'words', JSON.stringify({category: cat}))
      .subscribe((res: any) => {
        this.ytdCategories.push({label: label, value: res.data || 0});
        this.showCategoriesChart();
      })
    }

    showCategoriesChart() {
      if(this.ytdCategories.length === 8) {
        for(var i = 0; i < this.ytdCategories.length; i++) {
          this.ytdCategories[i]['color'] = this.pieColors[i];
        }

        this.loadCategoryChart();
      }
    }

    loadBarGraphs() {
      if(this.weekInFocusData.length === 4) {
        console.log('ready to draw graphs', this.weekInFocusData);
        for(var i = 0; i < this.weekInFocusData.length; i++) {
          let rec = this.weekInFocusData[i];
          let id = rec.table + 'Graph';
          this.weekColors[rec.table] = this.pieColors[i];
          this.loadWeekGraph(id, 'Week 2 of 2024 (' + rec.table + ')', rec.value, this.pieColors[i], rec.table); // id, label, data, color;
        }

        this.graphsLoaded = true;
      }
    }

    loadWeekGraph(id: string, label: string, value: number, color: string, table: string) {
      var speedCanvas = document.getElementById(id);

      var data = {
        labels: [""],
        datasets: [{
          label: '', // table.toUpperCase() + ' (' + value + ')',
          data: [value],
          backgroundColor: color,
        }]
      };

      var chartOptions = {
        legend: {
          display: false,
          position: 'top',
          align: 'start',
        },
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                // Display the first and last tick, hide others
                return value; //index === 0 || index === values.length - 1 ? value : '';
              }
            },
            gridLines: {
              display: true, // Hide y-axis grid lines
            },
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: false, // Hide y-axis grid lines
            },
          }]
        }
      };

      var lineChart = new Chart(speedCanvas, {
        type: 'horizontalBar',
        hover: true,
        data: data,
        options: chartOptions
      });
    }

    loadMetricsYTD(table) {
      this.mainService.getGroupsMetricsData(this.user, table, JSON.stringify({year: moment().format("YYYY")}))
      .subscribe((res: any) => {
        if(table === 'languages') {
          this.ytdLanguages = res.data;
          this.sortOutHighestAndAddColor();
        } else {
          this.ytdWords = res.data;
          this.sortByMonth(this.ytdWords);
          this.loadytdChart();
        }
      });
    }

    // manage ytd chart
    loadytdChart() {

      // Words Chart
      var speedCanvas = document.getElementById("ytdWordsChart");

      var dataSecond = {
        data: this.getytdData('words'),
        fill: false,
        borderColor: '#51CACF',
        backgroundColor: 'transparent',
        pointBorderColor: '#008471',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8
      };

      var speedData = {
        labels: this.getytdData('labels'),
        datasets: [dataSecond]
      };

      var chartOptions = {
        legend: {
          display: false,
          position: 'top'
        }
      };

      var lineChart = new Chart(speedCanvas, {
        type: 'line',
        hover: false,
        data: speedData,
        options: chartOptions
      });
    }

    getytdData(type) {
      let data = [];
      for(var i = 0; i < this.ytdWords.length; i++) {
        if(type === 'words') data.push(this.ytdWords[i].label);
        if(type === 'labels') data.push(this.ytdWords[i].month);
      }

      return data;
    }

    sortByMonth(arr) {
      var months = ["January", "February", "March", "April", "May", "June",
      	        "July", "August", "September", "October", "November", "December"];
      arr.sort(function(a, b){
          return months.indexOf(a.month)
               - months.indexOf(b.month);
      });
    }

    // manage language pie chat
    sortOutHighestAndAddColor() {
      // only top ten; already happening at server level
      // this.ytdLanguages = this.ytdLanguages.sort((a,b) => b.label-a.label).slice(0,10);

      // colors
      for(var i = 0; i < this.ytdLanguages.length; i++) {
        this.ytdLanguages[i]['color'] = this.pieColors[i];
      }
    }

    loadCategoryChart() {
      this.canvas = document.getElementById("chartLanguages");
      this.ctx = this.canvas.getContext("2d");
      this.chartLanguages = new Chart(this.ctx, {
        type: 'pie',
        data: {
          labels: this.getCategoryData('labels'),
          datasets: [{
            label: "Categories",
            pointRadius: 0,
            pointHoverRadius: 0,
            backgroundColor: this.pieColors,
            borderWidth: 0,
            data: this.getCategoryData('words')
          }]
        },

        options: {

          legend: {
            display: false
          },

          pieceLabel: {
            render: 'percentage',
            fontColor: ['white'],
            precision: 2
          },

          tooltips: {
            enabled: true
          },

          scales: {
            yAxes: [{

              ticks: {
                display: false
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "transparent",
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent"
              },
              ticks: {
                display: false,
              }
            }]
          },
        }
      });
    }

    getCategoryData(type) {
      let data = [];
      for(var i = 0; i < this.ytdCategories.length; i++) {
        if(type === 'words') data.push(this.ytdCategories[i].value);
        if(type === 'labels') data.push(this.ytdCategories[i].label);
      }

      return data;
    }
}
