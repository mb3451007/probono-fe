import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import Chart from 'chart.js';
import { AuthService } from '../../api/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EventsService } from '../../api/events.service';
import { MainService } from '../../api/main.service';
import { ModalConfig } from './modal.config';
import { ModalComponent } from './modal/modal.component';
import * as moment from 'moment';

@Component({
    selector: 'admin-cmp',
    moduleId: module.id,
    templateUrl: 'admin.component.html'
})

export class AdminComponent implements OnInit{
  user: any;
  activeButtons: any[] = [];
  page: string = '';
  entries: any[] = [];
  entriesOrganisations: any[] = [];
  entriesVolunteers: any[] = [];
  entriesWords: any[] = [];
  entriesHours: any[] = [];
  entriesStars: any[] = [];
  entriesProjects: any[] = [];

  @ViewChild('modal') private modalComponent: ModalComponent;
  modalConfig: ModalConfig = {
    modalTitle: 'Add New',
    table: '',
    id: '',
    type: 'new',
    record: '',
    loadEntries: false,
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Exit',
    animation: true,
    centered: true
  };
  showForm: boolean = false;
  isLoading: boolean = false;
  showRecords: boolean = false;
  error: any;
  numberWords = 0;
  numberOrganisations = 0;
  numberVolunteers = 0;
  numberHours = 0;
  pageItem: number = 1;
  itemsPerPage = 250;
  totalItems: any;
  isSearching: boolean = false;

  csvFile: any[] = [];
  volunteerFile: any[] = [];
  languages: any[] = [];
  allVolunteers: any[] = [];
  volunteerNamesMissed: any[] = [];

  sortType: string = '';
  sortMode: string = 'asc';
  sortField: string = 'date_created';
  projectsStatus: string = 'In Progress';
  filter: string = "";

  constructor (
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private events: EventsService,
    private mainService: MainService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit(){
    this.user = this.authService.getData('user');

    // else log out to dashboard home
    if(!this.user) {
      this.router.navigate(['/dashboard']);
    }

    this.events.userSubject.next(this.user);

    this.activeButtons = [ // starts at 200
      {id: 1, name: 'Organisations', url: 'organisations', table: 'organisations', status: 'inactive'},
      {id: 2, name: 'Volunteers', url: 'volunteers', table: 'volunteers', status: 'inactive'},
      {id: 3, name: 'Hours', url: 'hours', table: 'hours', status: 'inactive'},
      {id: 4, name: 'Words', url: 'words', table: 'words', status: 'inactive'},
      {id: 5, name: 'Projects', url: 'projects', table: 'projects', status: 'inactive'},
      {id: 6, name: 'Stars', url: 'stars', table: 'stars', status: 'inactive'},
    ];

    this.ref.markForCheck();
    this.loadPage();
    this.subscribeToRefresh();
  }

 loadPage() {
    // active page
    this.route.params.subscribe(params => {
       if(params.page) {
         this.page = params.page;
       } else {
         this.router.navigate(['/admin-summary/organisations']);
       }
       this.loadPageData();
    });
  }

  changePage(page: string) {
    this.page = null;
    setTimeout(() => {
      this.page = page
    }, 10);
  }

  async loadPageData() {
    this.loadMetrics('organisations');
    this.loadMetrics('volunteers');
    this.loadMetrics('words');
    this.loadMetrics('hours');

    this.showForm = false;
    this.showRecords = false;
    this.isLoading = true;
    this.entries = [];
    this.sortField = 'date_created';

    for(var i = 0; i < this.activeButtons.length; i++) {
      if(this.activeButtons[i].url === this.page) {
        this.activeButtons[i].status = 'active';
      } else {
        this.activeButtons[i].status = 'inactive';
      }
    }

    this.ref.markForCheck();
    if(this.page) {
      await this.fetchEntries(this.page);

      // show records
      this.showRecords = true;
      this.ref.markForCheck();
    }

  }

  // Organisation
  addOrganisation() {
    this.showForm = true;
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  backList() {
    this.showForm = false;
    this.showRecords = false;
    this.entries = [];
    this.ref.markForCheck();
    this.loadPageData();
  }

  switchPages(page: any) {
    this.pageItem = 1;
  }

  fetchEntries(table: string): Promise<any[]> {
    if(this.sortField === 'date_created') {
      if(table === 'organisations') this.sortField = 'organisations.name';
      if(table === 'volunteers') this.sortField = 'volunteers.first_name';
      if(table === 'projects') this.sortField = 'projects.due'; // sortMode
      if(table === 'stars') this.sortField = 'stars.date_created'; // sortMode
    }

    this.isLoading = true;
    // this.sortMode = 'asc';
    let selector: any = table === 'words' ? { 'words.status': 'active'} : table === 'hours' ? { 'hours.status': 'active'} : table === 'organisations' ? { 'organisations.status': 'active'} : table === 'projects' ? (this.projectsStatus === '' ? {} : {'projects.progress': this.projectsStatus}) : { 'volunteers.status': 'active'};
    console.log('sort mode', this.sortMode);
    console.log('sort field', this.sortField);

    if(table === 'stars') {
      selector = { 'stars.status': 'active'};
    }
    return new Promise<any[]>((resolve, reject) => {
      this.mainService.getEntriesBySelectors(this.user, table, JSON.stringify(selector), this.itemsPerPage, this.pageItem, this.sortField, this.sortMode)
      .subscribe((res: any) => {
        console.log('got', res);
        this.entries = res.entries;
        this.isLoading = false;
        if(table === 'organisations') this.entriesOrganisations = res.entries;
        if(table === 'volunteers') this.entriesVolunteers = res.entries;
        if(table === 'words') this.entriesWords = res.entries;
        if(table === 'hours') this.entriesHours = res.entries;
        if(table === 'stars') this.entriesStars = res.entries;
        if(table === 'projects') this.entriesProjects = res.entries;
        this.totalItems = res.entries.length;
        this.ref.markForCheck();
        this.sortProjects();
        resolve(this.entries);
      }, err => {
        console.log('cant get', err);
        this.error = err;
        this.isLoading = false;
        this.isSearching = false;
        reject(err);
      })
    })
  }

  sortProjects() {
    // archived
    // expired
    //
  }

  loadMetrics(table) {
    this.mainService.getMetrics(this.user, table, JSON.stringify({status: 'active'}))
    .subscribe((res: any) => {
      if(table === 'words')         this.numberWords          = res.data;
      if(table === 'organisations') this.numberOrganisations  = res.data;
      if(table === 'volunteers')    this.numberVolunteers     = res.data;
      if(table === 'hours')         this.numberHours     = res.data;
    })
  }

  searchFor(ev) {
    let string = ev.target.value;
    this.search(this.page, string);
  }

  search(table, searchstring) {
    this.isSearching = true;
    let key = 'first_name';
    if(table === 'organisations') key = 'name';
    if(table === 'projects') key = 'task';

    this.mainService.search(this.user, table, key, searchstring, this.itemsPerPage)
    .subscribe((res: any) => {
      this.isSearching = false;
      this.entries = res.entries;
      if(table === 'organisations') this.entriesOrganisations = res.entries;
      if(table === 'volunteers') this.entriesVolunteers = res.entries;
      if(table === 'words') this.entriesWords = res.entries;
      if(table === 'hours') this.entriesHours = res.entries;
      if(table === 'stars') this.entriesStars = res.entries;
      if(table === 'projects') this.entriesProjects = res.entries;
      this.totalItems = res.entries.length;
      this.ref.markForCheck();
    }, err => {
      this.isSearching = false;
    })
  }


  async setPerPage(number) {
    this.isSearching = true;
    this.itemsPerPage = number;
    this.pageItem = 1;

    //reload
    await this.fetchEntries(this.page);
    this.isSearching = false;
  }

  async setProjectsStatus(status) {
    this.isSearching = true;
    this.projectsStatus = status;
    this.pageItem = 1;

    //reload
    await this.fetchEntries(this.page);
    this.isSearching = false;
  }

  async loadNavPage(ev) {
    this.isSearching = true;
    this.pageItem = ev;
    await this.fetchEntries(this.page);
    this.isSearching = false;
  }

  subscribeToRefresh() {
    this.events.refresh$
    .subscribe((data: any) => {
      if(data === 'refresh') {
        this.isSearching = true;
        this.fetchEntries(this.page)
        .then((rec: any) => {
          this.isSearching = false;
        })
      }
    })
  }

  // clearn up
  fileUploaded(ev) {
    let files = ev.target.files;
    console.log('got', files);
    if(!files || files.length == 0) {
      alert("No file chosen");
      return;
    }

    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.CSV') {
        //Here calling another method to read CSV file into json
        this.csvFileToJSON(files[0]);
    } else {
        alert("Please select a valid csv file.");
    }
  }

  csvFileToJSON(file) {
    try {
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    const global = this;
    reader.onload = function(e: any) {
        var jsonData = [];
        var headers = [];
        var rows = e?.target?.result?.split("\r\n");
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].split(",");
            var rowData = {};
            for(var j=0;j<cells.length;j++){
                if(i==0){
                    var headerName = cells[j].trim();
                    headers.push(headerName);
                }else{
                    var key = headers[j];
                    if(key){
                        rowData[key] = cells[j].trim();
                    }
                }
            }
            //skip the first row (header) data
            if(i!=0){
                jsonData.push(rowData);
            }
        }

        global.previewFile(jsonData);
      }
    } catch(e){
        console.error(e);
    }
  }

  previewFile(jsonData){
    this.csvFile = jsonData;
  }

  async showData(submit) {
    this.volunteerFile = [];
    this.volunteerNamesMissed = [];

    // words
    for(var i = 0; i < this.csvFile.length; i++) {
      let record = this.csvFile[i];
      if(!record['Word Count'] || record['Word Count'] === "" || record.Volunteer === 'Total' || record.Volunteer === '') {
        continue;
      }

      let obj = {
        table_name: 'words',
        organisation_id: 35, // must
        volunteer_id: this.getVolunteer(record.Volunteer), // must
        task: record.Task,
        words: parseInt(record['Word Count']),
        month: moment().format('MMMM'),
        year: moment().format('YYYY'),
        language: this.getLang(record, 'lang'), // langs are a must
        language_to: this.getLang(record, 'to'),
        language_code: this.getLang(record, 'code'),
        language_code_to: this.getLang(record, 'code_to'),
        verified: true,
        date_created: moment().format(),
        date_updated: moment().format(),
        added_by: this.user.id,
        status: 'active'
      }

      if(submit) {
        console.log('submitting ' + (i + 1) + ' of ' + this.csvFile.length);
        let id = await this.submitData(obj);
        obj['id'] = id;
      }


      this.volunteerFile.push(obj);
    }

    let noLangs = this.volunteerFile.filter(rec => rec.language_to === "");
    let noVols = this.volunteerFile.filter(rec => !rec.volunteer_id);
  }

  updateOrg() {
    let files = this.volunteerFile;
    let id

    let ids = [];
    for(var i = 0; i < files.length; i++) {
      id = files[i].organisation_id;

      if(ids.length < 5) {
        if(ids.includes(files[i].volunteer_id) === false) {
          ids.push(files[i].volunteer_id)
        }
      }
    }

    let data = {
      table_name: 'organisations',
      volunteers: ids,
    }

    console.log('to save', data);
    console.log('id', id);
    //return;

    if(id && ids.length > 0) {
      this.mainService.updateEntry(this.user, data, id)
      .subscribe((res: any) => {
        console.log('updated', res);
      }, err => {
        console.log('err', err)
      })
    }

  }

  async createVolunteers() {
    let data = [];

    for(var i = 0; i < this.volunteerNamesMissed.length; i++) {
      let name = this.volunteerNamesMissed[i];
      let obj = {
        table_name: 'volunteers',
        first_name: name.split(" ")[0],
        last_name: name.replace(name.split(" ")[0], "").trimStart(),
        email: name.split(" ")[0] + '@proz.com',
        user_account: "",
        language: 'English',
        language_code: 'En',
        profile: 'no profile',
        verified: true,
        date_created: moment().format(),
        date_updated: moment().format(),
        added_by: this.user.id,
        status: 'active'
      }
      console.log('submitting ' + (i + 1) + ' of ' + this.volunteerNamesMissed.length);
      let id = await this.submitData(obj);
      obj['id'] = id;

      data.push(obj);
      this.allVolunteers.push(obj);
    }

    console.log('add to volunteers', data);
  }

  getVolunteer(name) {
    let id;
    let fullVol = this.allVolunteers.find(rec => (rec.first_name + ' ' + rec.last_name).indexOf(name) !== -1);

    if(fullVol) {
      id = fullVol.id;
    } else {
      if(name == 'Pep Puigiboix') {
        id = 314;
      }

      if(name == 'Stavros Dafis') {
        id = 315;
      }

      if(name == 'Gabriella Boareto'){
        id = 316
      }

      if(name == 'Fernando Lipp'){
        id = 317
      }

      if(name == 'Manuela Vulcano'){
        id = 318
      }

      if(name == 'Eliza Claudia Filimon'){
        id = 319
      }

      if(name == 'Monica Taruna'){
        id = 320
      }

      if(!id) {
        console.log('cant find name', name);
        if(this.volunteerNamesMissed.includes(name) == false) {
          this.volunteerNamesMissed.push(name);
        }
      }
    }

    return id;
  }

  getLang(code, type) {
    let codeArr = code.Code.split("-");

    if(codeArr.length === 0) {
      return "";
    }

    if(codeArr.length === 1) {
      let target = JSON.parse(JSON.stringify(codeArr));
      codeArr = ["EN", target[0]];
    }

    let name = "";
    let lngCode = "";
    let source = this.languages.find(rec => rec.code.toLowerCase() == codeArr[0].toLowerCase());
    if(!source) {
      source = this.languages.find(rec => rec.code == 'en');
    }
    let language = this.languages.find(rec => rec.code.toLowerCase() == codeArr[1].toLowerCase());
    if(!language) {
      language = this.languages.find(rec => rec.name.indexOf(code['Target Language']));
      if(!language) {
        name = code['Target Language'];
      }
    }

    if(source && (type == 'lang' || type === 'code')) {
      name = source.name;
      lngCode = source.code
    }

    if(language && (type == 'to' || type === 'code_to')) {
      name = language.name;
      lngCode = language.code
    }

    return (type == 'lang' || type === 'to') ? name : lngCode;
  }

  async prepareAndSubmitOrgs() {
    console.log('current file', this.csvFile);

    // organisations
    for(var i = 0; i < this.csvFile.length; i++) {
      let record = this.csvFile[i];
      if(!record.Client || record.Client === "") {
        continue;
      }

      let obj = {
        table_name: 'organisations',
        name: record.Client,
        details: "More about " + record.Client,
        website: record.Website.startsWith('https') ? record.Website : 'https://' + record.Website,
        language: 'English',
        language_code: 'En',
        verified: true,
        volunteers: [],
        date_created: moment().format(),
        date_updated: moment().format(),
        added_by: this.user.id,
        status: 'active'
      }
      console.log('submitting ' + (i + 1) + ' of ' + this.csvFile.length);
      let id = await this.submitData(obj);
      obj['id'] = id;
      this.volunteerFile.push(obj);
    }

    console.log('fianl submited', this.volunteerFile);
  }

  async prepareSubmitVolunteers() {

    // volunteers
    for(var i = 0; i < this.csvFile.length; i++) {
      let record = this.csvFile[i];
      if(!record.Volunteer || record.Volunteer === "") {
        continue;
      }

      let obj = {
        table_name: 'volunteers',
        first_name: record.Volunteer.split(" ")[0],
        last_name: record.Volunteer.replace(record.Volunteer.split(" ")[0], "").trimStart(),
        email: record.Volunteer.split(" ")[0] + '@proz.com',
        user_account: "",
        language: this.getLanguage(record.Language, 'language'),
        language_code: this.getLanguage(record.Language, 'code'),
        profile: record.Profile,
        verified: true,
        date_created: moment().format(),
        date_updated: moment().format(),
        added_by: this.user.id,
        status: 'active'
      }
      console.log('submitting ' + (i + 1) + ' of ' + this.csvFile.length);
      let id = await this.submitData(obj);
      obj['id'] = id;
      this.volunteerFile.push(obj);
    }

    let noCode = this.volunteerFile.filter(rec => rec.language_code == '');
    /*
    this.mainService.deleteRecordsBySelectors(this.user, JSON.stringify({}), 'volunteers', null)
    .subscribe((res: any) => {
      console.log('del', res);
    }, err => {
      console.log('err', err)
    })
    */
  }

  submitData(data) {
    return new Promise((resolve, reject) => {
      this.mainService.submitForm(this.user, data)
      .subscribe((res: any) => {
        resolve(res.entry[0].id);
      }, err => {
        console.log('Error!', err);
        reject(err);
      })
    });
  }

  getLanguage(lang, type) {
    let name = lang;
    let code = "";

    let language = this.languages.find(rec => rec.name.toLowerCase() == lang.toLowerCase());

    if(!language) {
       language = this.languages.find(rec => rec.name.indexOf(lang) !== -1);
    }

    if(language) {
      name = language.name;
      code = language.code;
    }

    return type === 'language' ? name : code;
  }

  async sortData(type) {
    this.isSearching = true;
    this.sortType = type;
    if(this.sortMode === '' || this.sortMode === 'desc') {
      this.sortMode = 'asc';
    } else if(this.sortMode === 'asc') {
      this.sortMode = 'desc';
    }

    if(this.sortType === 'words') {
      this.sortField = 'words';
    }

    if(this.page === 'organisations') {
      if(this.sortType === 'name') {
        this.sortField = 'organisations.name';
      }

      await this.fetchEntries('organisations');
    }

    if(this.page === 'volunteers') {
      if(this.sortType === 'name') {
        this.sortField = 'volunteers.first_name';
      }

      await this.fetchEntries('volunteers');
    }

    if(this.page === 'projects') {
      if(this.sortType === 'name') {
        this.sortField = 'organisations.name';
      }

      await this.fetchEntries('projects');
    }

    this.isSearching = false;
  }


}
