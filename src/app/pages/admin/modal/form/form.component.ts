import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef  } from '@angular/core';
import { EventsService } from '../../../../api/events.service';
import { AuthService } from '../../../../api/auth.service';
import { MainService } from '../../../../api/main.service';
import * as moment from 'moment';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { CATEGORIES, LANGUAGES } from '../../../../../constants';

@Component({
  selector: 'app-modal-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit{
  @Input() table_name: string = '';
  clientForm: any;
  childData: any;
  formEntries: any[] = [];
  assortedEntries: any[] = [];
  months: any[] = [];
  activeMonth: any = {};
  entry: any = {};
  editStatus: boolean = true;
  activeYear: any;
  years: any = [];
  currentPosition: any;
  expand: boolean = false;
  formEntry: FormGroup;
  user: any;
  showForm: boolean = false;
  @Input() record: any;
  @Input() recordId: any;
  @Input() type: any;
  @Output() formActions = new EventEmitter<string>();
  dropdownSettings:IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowRemoteDataSearch: true,
    noDataAvailablePlaceholderText: 'No match.',
    allowSearchFilter: true
  };
  dropdownSettingsLanguages:IDropdownSettings = {
    singleSelection: true,
    idField: 'code',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowRemoteDataSearch: false,
    noDataAvailablePlaceholderText: 'No match.',
    allowSearchFilter: true
  };
  dropdownSettingsLanguagesMultiple:IDropdownSettings = {
    singleSelection: false,
    idField: 'code',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowRemoteDataSearch: false,
    noDataAvailablePlaceholderText: 'No match.',
    allowSearchFilter: true
  };
  dropdownSettingsVolunteers:IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowRemoteDataSearch: true,
    noDataAvailablePlaceholderText: 'No match.',
    allowSearchFilter: true
  };
  entriesOrganisations: any[] = [];
  entriesVolunteers: any[] = [];
  entriesWords: any[] = [];
  entriesHours: any[] = [];
  languages: any[] = [];
  activeDate = moment().format("YYYY-MM-DD");
  uploadingFile: boolean = false;
  csvFile: any[] = [];
  headers: any[] = [];
  isLoading: boolean = false;
  categories: any[] = CATEGORIES;
  contributions: any[] = [
    {id: 1, type: 'Ambassador', stars: 20, perMonth: true },
    {id: 2, type: 'Ninja', stars: 15, perMonth: true },
    {id: 3, type: 'Crew Member', stars: 15, perMonth: true },
    {id: 4, type: 'Blog post', stars: 5, perMonth: false },
  //  {id: 5, type: 'Bright Idea 1', stars: 2, perMonth: false },
    {id: 6, type: 'Bright Idea', stars: 4, perMonth: false },
    {id: 7, type: 'Open House', stars: 2, perMonth: false },
    {id: 8, type: 'Other Contributions', stars: 0, perMonth: false }
  ];

  constructor(
    public events: EventsService,
    private ref: ChangeDetectorRef,
    private authService: AuthService,
    private mainService: MainService,
    public formbuilder: FormBuilder
  ) {
    this.loadLanguages();
  }

    ngOnInit(): void {
      this.showForm = false;
      this.user = this.authService.getData('user');
      this.loadForm();
      this.ref.markForCheck();
    }

    loadForm() {
      this.user = this.authService.getData('user');
      if(!this.user) {
        alert("No User!");
      };

      if(this.table_name === 'organisations') {
        this.search('volunteers', '');
        this.formEntry = this.formbuilder.group({
          table_name: [this.table_name, Validators.required],
          name: [this.record ? this.record.name : '', Validators.required],
          details: [this.record ? this.record.details : '', Validators.required],
          website: [this.record ? this.record.website : 'https://', Validators.required],
          language: [this.record ? [{name: this.record.language, code: this.record.language_code}] : [{name: 'English', code: 'en'}], Validators.required],
          language_code: [this.record ? this.record.language_code : 'En', Validators.required],
          verified: [this.record ? this.record.verified : true, Validators.required],
          volunteers: [this.record ? this.getVolunteerRecords() : []],
          contact_name: [this.record ? this.record.contact_name : ""],
          contact_email: [this.record ? this.record.contact_email : ""],
          logo: [this.record && this.record.logo ? this.record.logo : ""],
          date_created: [this.record ? this.record.date_created : moment().format(), Validators.required],
          date_updated: [moment().format(), Validators.required],
          added_by: [this.record ? this.record.added_by : this.user.id, Validators.required],
          status: [this.record ? this.record.status : 'active', Validators.required]
        });
      }

      if(this.table_name === 'projects') {
        this.search('volunteers', '');
        this.search('organisations', '');
        this.formEntry = this.formbuilder.group({
          table_name: [this.table_name, Validators.required],
          organisation_id: [this.record ? [{name: this.record.organisation, id: this.record.organisation_id}] : '', Validators.required],
          task: [this.record ? this.record.task : '', Validators.required],
          words: [this.record ? this.record.words : 0, Validators.required],
          progress: [this.record ? this.record.progress : 'In Progress', Validators.required],
          month: [this.record ? this.record.month : moment().format('MMMM'), Validators.required],
          year: [this.record ? this.record.year : moment().format('YYYY'), Validators.required],
          due: [this.record ? moment(this.record.due).format("YYYY-MM-DD") : moment().format('YYYY-MM-DD'), Validators.required],
          language: [this.record ? [{name: this.record.language, code: this.record.language_code}] : [{name: 'English', code: 'en'}], Validators.required],
          language_to: [this.record ? [{name: this.record.language_to, code: this.record.language_code_to}] : [{name: 'English', code: 'en'}], Validators.required],
          language_code: [this.record ? this.record.language_code : 'En', Validators.required],
          language_code_to: [this.record ? this.record.language_code_to : 'En', Validators.required],
          verified: [this.record ? this.record.verified : true, Validators.required],
          volunteers: [this.record ? this.getVolunteerRecords() : []],
          date_created: [this.record ? this.record.date_created : moment().format(), Validators.required],
          date_updated: [moment().format(), Validators.required],
          added_by: [this.record ? this.record.added_by : this.user.id, Validators.required],
          status: [this.record ? this.record.status : 'active', Validators.required]
        });
      }

      if(this.table_name === 'volunteers') {
        this.formEntry = this.formbuilder.group({
          table_name: [this.table_name, Validators.required],
          first_name: [this.record ? this.record.first_name : '', Validators.required],
          last_name: [this.record ? this.record.last_name : '', Validators.required],
          email: [this.record ? this.record.email : '', Validators.required],
          user_account: [this.record ? this.record.user_account : '', Validators.required],
          language: [this.record ? [{name: this.record.language, code: this.record.language_code}] : [{name: 'English', code: 'en'}], Validators.required],
          language_code: [this.record ? this.record.language_code : 'En', Validators.required],
          profile: [this.record ? this.record.profile : '', Validators.required],
          secondary_languages: [this.record && this.record.secondary_languages?.length > 0 ? this.record.secondary_languages : [], Validators.required],
          verified: [this.record ? this.record.verified : true, Validators.required],
          date_created: [this.record ? this.record.date_created : moment().format(), Validators.required],
          date_updated: [moment().format(), Validators.required],
          added_by: [this.record ? this.record.added_by : this.user.id, Validators.required],
          status: [this.record ? this.record.status : 'active', Validators.required]
        });
      }

      if(this.table_name === 'bulk add') {
        this.formEntry = this.formbuilder.group({
          csv_file: ['', Validators.required],
          names: ['', Validators.required],
          profile: ['', Validators.required],
        });
      }

      if(this.table_name === 'words') {
        this.search('organisations', '');
        this.search('volunteers', '');
        if(this.record) this.activeDate = moment(this.record.date_created, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
        this.formEntry = this.formbuilder.group({
          table_name: [this.table_name, Validators.required],
          organisation_id: [this.record ? [{name: this.record.organisation, id: this.record.organisation_id}] : '', Validators.required],
          volunteer_id: [this.record ? [{name: this.record.volunteer_first_name + ' ' + this.record.volunteer_last_name, id: this.record.volunteer_id}] : '', Validators.required],
          task: [this.record ? this.record.task : '', Validators.required],
          words: [this.record ? this.record.words : 0, Validators.required],
          month: [this.record ? this.record.month : moment().format('MMMM'), Validators.required],
          year: [this.record ? this.record.year : moment().format('YYYY'), Validators.required],
          language: [this.record ? [{name: this.record.language, code: this.record.language_code}] : [{name: 'English', code: 'en'}], Validators.required],
          language_to: [this.record ? [{name: this.record.language_to, code: this.record.language_code_to}] : [{name: 'English', code: 'en'}], Validators.required],
          language_code: [this.record ? this.record.language_code : 'En', Validators.required],
          language_code_to: [this.record ? this.record.language_code_to : 'En', Validators.required],
          verified: [this.record ? this.record.verified : true, Validators.required],
          date_created: [this.record ? this.record.date_created : moment().format(), Validators.required],
          date_updated: [moment().format(), Validators.required],
          added_by: [this.record ? this.record.added_by : this.user.id, Validators.required],
          status: [this.record ? this.record.status : 'active', Validators.required],
          category: [this.record ? this.record.category : 'environment', Validators.required],
          // project
          create_project: [this.type == 'new' ? 'yes' : 'no'],
          project_deadline: [moment().format("YYYY-MM-DD")],
        });
      }

      if(this.table_name === 'hours') {
        this.search('organisations', '');
        this.search('volunteers', '');
        if(this.record) this.activeDate = moment(this.record.date_created, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
        this.formEntry = this.formbuilder.group({
          table_name: [this.table_name, Validators.required],
          organisation_id: [this.record ? [{name: this.record.organisation, id: this.record.organisation_id}] : '', Validators.required],
          volunteer_id: [this.record ? [{name: this.record.volunteer_first_name + ' ' + this.record.volunteer_last_name, id: this.record.volunteer_id}] : '', Validators.required],
          task: [this.record ? this.record.task : '', Validators.required],
          hours: [this.record ? this.record.hours : 0, Validators.required],
          month: [this.record ? this.record.month : moment().format('MMMM'), Validators.required],
          year: [this.record ? this.record.year : moment().format('YYYY'), Validators.required],
          language: [this.record ? [{name: this.record.language, code: this.record.language_code}] : [{name: 'English', code: 'en'}], Validators.required],
          language_to: [this.record ? [{name: this.record.language_to, code: this.record.language_code_to}] : [{name: 'English', code: 'en'}], Validators.required],
          language_code: [this.record ? this.record.language_code : 'En', Validators.required],
          language_code_to: [this.record ? this.record.language_code_to : 'En', Validators.required],
          verified: [this.record ? this.record.verified : true, Validators.required],
          date_created: [this.record ? this.record.date_created : moment().format(), Validators.required],
          date_updated: [moment().format(), Validators.required],
          added_by: [this.record ? this.record.added_by : this.user.id, Validators.required],
          status: [this.record ? this.record.status : 'active', Validators.required],
          // project
          create_project: ['no'],
          project_deadline: [moment().format("YYYY-MM-DD")],
        });
      }

      if(this.table_name === 'stars') {
        this.search('volunteers', '');
        if(this.record) this.activeDate = moment(this.record.date_created, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");
        this.formEntry = this.formbuilder.group({
          table_name: [this.table_name, Validators.required],
          volunteer_id: [this.record ? [{name: this.record.volunteer_first_name + ' ' + this.record.volunteer_last_name, id: this.record.volunteer_id}] : '', Validators.required],
          stars: [this.record ? this.record.stars : 0, Validators.required],
          type: [this.record ? this.record.type : 8, Validators.required],
          reason: [this.record ? this.record.reason : 'Other', Validators.required],
          month: [this.record ? this.record.month : moment().format('MMMM'), Validators.required],
          year: [this.record ? this.record.year : moment().format('YYYY'), Validators.required],
          verified: [this.record ? this.record.verified : true, Validators.required],
          date_created: [this.record ? this.record.date_created : moment().format(), Validators.required],
          date_updated: [moment().format(), Validators.required],
          added_by: [this.record ? this.record.added_by : this.user.id, Validators.required],
          status: [this.record ? this.record.status : 'active', Validators.required],
        });
      }

      this.showForm = true;
    }

    setStars(ev: any) {
      let value = this.contributions.find((rec: any) => rec.id == ev.target.value);
      if(value) {
        this.formEntry.controls['stars'].setValue(value.stars);
      }
    }

    uploadLogo(ev: any, control, formCtrlName) {
      let file = ev.target.files[0];
      var nameStr = file.name.replace(/\s/g, '');
      var filename = nameStr.replace(/[^0-9a-zA-Z.]/g, "");
      var name = moment().format("YYYY_MM_DD_") + Number(new Date) + '_' + filename;
      this.uploadingFile = true;

      this.mainService.uploadFile(this.user, file, name)
      .then((res: any) => {
        control.controls[formCtrlName].setValue(res);
        this.uploadingFile = false;
      }, err => {
        control.controls[formCtrlName].setValue("");
        this.uploadingFile = false;
      })
    }

    removeFile(control, formCtrlName) {
      control.controls[formCtrlName].setValue("");
    }

    getVolunteerRecords() {
      let idArr = [];
      if(this.record.volunteerData.length) {
        for(var i = 0; i < this.record.volunteerData.length; i++) {
          idArr.push({id: this.record.volunteerData[i].id, name: this.record.volunteerData[i].first_name + ' ' + this.record.volunteerData[i].last_name});
        }
      }

      return idArr;
    }

    setMonthYear(ev) {
      this.formEntry['controls']['month'].setValue(moment(ev.target.value, 'YYYY-MM-DD').format("MMMM"));
      this.formEntry['controls']['year'].setValue(moment(ev.target.value, 'YYYY-MM-DD').format("YYYY"));
      this.formEntry['controls']['date_created'].setValue(moment(ev.target.value, 'YYYY-MM-DD').format("YYYY-MM-DD HH:mm:ss"));
    }

    onItemSelect(data, formControl, id) {
      //this.formEntry['controls'][formControl].setValue(data[id]);

      // if words and volunteer is selected, set the language
      if((this.table_name === 'words' || this.table_name === 'hours') && formControl === 'volunteer_id') {
        let volunteer = this.entriesVolunteers.find((rec: any) => rec.id === data.id);
        if(volunteer) {

          // set language
          this.formEntry['controls']['language_to'].setValue([{name: volunteer.language, code: volunteer.language_code}]);
          this.formEntry['controls']['language_code_to'].setValue(volunteer.language_code);
        }
      }
    }

    onSelectAll(ev) {
    }

    loadData(table) {
    }

    filterRecords(table, ev) {
      this.search(table, ev.target.value);
    }

    onFilterChange(table, ev) {
      this.search(table, ev);
    }

    search(table, searchstring) {
      let key = 'first_name';
      if(table === 'organisations') key = 'name';
    //  this.dropdownSettings.allowRemoteDataSearch = false;
      this.dropdownSettings.noDataAvailablePlaceholderText = 'Searching DB...';
      this.mainService.search(this.user, table, key, searchstring, 5)
      .subscribe((res: any) => {
        if(table === 'organisations') this.entriesOrganisations = res.entries;
        if(table === 'volunteers') this.entriesVolunteers = this.readyForSearch(res.entries);
        if(table === 'words') this.entriesWords = res.entries;
        if(table === 'hours') this.entriesHours = res.entries;
        this.ref.markForCheck();
      })
    }

    readyForSearch(data) {
      for(var i = 0; i < data.length; i++) {
        data[i]['name'] = data[i].first_name + ' ' + data[i].last_name;
      }

      return data;
    }

    setYears() {
      this.years = [];
      let firstYear = parseInt(moment().subtract(10, 'years').format('YYYY'));
      this.activeYear = parseInt(moment().format('YYYY'));

      for(var i = firstYear; i <= this.activeYear; i++) {
        this.years.push(i);
      }

      this.years.reverse();
    }

    getEntriesByYear(year: any) {
      this.activeYear = year.target.value;
    }

    allowEdit() {
      this.editStatus = !this.editStatus;
    }

    async processFile(data: any) {
      // extract id, url and names
      let idUrlNamesArr = this.csvFile.map((rec: any) => {
        let id = parseInt(rec[data.profile], 10) || null;
        let url = id ? `proz.com/profile/${id}` : null;

        if (!id && rec[data.profile]) {
          const urlArr = rec[data.profile].split("/");
          if (urlArr.length > 0) {
            id = parseInt(urlArr[urlArr.length - 1], 10) || null;
            url = rec[data.profile];
          }
        }

        const namesArr = rec[data.names].split(" ");
        const first_name = namesArr[0] || "Null";
        const last_name = namesArr.slice(1).join(" ") || "Null";

        return { id, url, first_name, last_name };
      });

      // compare with Probono dashboard db
      let allVolunteers = await this.loadAll('volunteers');

      let volIds = allVolunteers.map((rec: any) => {
        let id = parseInt(rec.profile, 10) || null;
        if (!id) {
          const urlArr = rec.profile.split("/");
          if (urlArr.length > 0) {
            id = parseInt(urlArr[urlArr.length - 1], 10) || null;
          }
        }

        return id;
      });

      let nonDupes = idUrlNamesArr.filter((item: any) => volIds.includes(item.id) === false);

      // pull data from PROZ
      let noneDupesIds = nonDupes.map((rec: any) => {return rec.id});

      //let withProZdata = await this.getEntitiesByIDs(noneDupesIds);
      //console.log('final proz data', withProZdata);

      // save volunteers
      for(let i = 0; i < nonDupes.length; i++) {
        let item = nonDupes[i];
        let volunteer = {
          table_name: 'volunteers',
          first_name: item.first_name,
          last_name: item.last_name,
          email: "",
          user_account: '',
          language: 'English',
          language_to: 'English',
          language_code: 'En',
          language_code_to: 'En',
          profile: item.url,
          secondary_languages: [],
          verified: true,
          date_created: moment().format(),
          date_updated: moment().format(),
          added_by: this.user.id,
          status: 'active'
        };
        console.log('saving', i + ' of ' + nonDupes.length);
        const saved = await this.saveData(volunteer);
        if(!saved) {
          break;
        }
      }

    }

    saveData(data: any) {
      return new Promise((resolve, reject) => {
        console.log('final', data);
        this.mainService.submitForm(this.user, data)
        .subscribe((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        })
      });
    }


    getEntitiesByIDs(ids: any[]) {
      console.log('user', this.user);
      return new Promise<any[]>((resolve, reject) => {
        this.mainService.analizeLinguists(this.user, {ids: ids, emails: []})
        .subscribe((res: any) => {
          this.isLoading = false;
          resolve(res.entries);
        }, err => {
          console.log('err', err);
          this.isLoading = false;
          reject(err);
        })
      })
    }

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
          global.headers = [];
          var rows = e?.target?.result?.split("\r\n");
          for (var i = 0; i < rows.length; i++) {
              var cells = rows[i].split(",");
              var rowData = {};
              for(var j=0;j<cells.length;j++){
                  if(i==0){
                      var headerName = cells[j].trim();
                      global.headers.push(headerName);
                  }else{
                      var key = global.headers[j];
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

    loadAll(table: string) {
      return new Promise<any[]>((resolve, reject) => {
        this.mainService.getEntriesBySelectors(this.user, table, JSON.stringify({ 'volunteers.status': 'active'}), 1000000, 1, 'volunteers.first_name', 'asc')
        .subscribe((res: any) => {
          this.isLoading = false;
          resolve(res.entries);
        }, err => {
          this.isLoading = false;
          reject(err);
        })
      })
    }

    async postData(data: any) {
      let cloneData = JSON.parse(JSON.stringify(data));
      if(data.table_name === 'words' || data.table_name === 'hours' || data.table_name === 'stars') {
        // set project data
        delete data.create_project;
        delete data.project_deadline;
        const proClone = JSON.parse(JSON.stringify(cloneData));
        if(cloneData.create_project === 'yes') await this.saveProject(proClone);

        if(data.volunteer_id) data.volunteer_id = cloneData.volunteer_id ? cloneData.volunteer_id[0].id : null;
        if(data.organisation_id) data.organisation_id = cloneData.organisation_id ? cloneData.organisation_id[0].id : null;
      }

      if(data.table_name === 'projects') {
        data.organisation_id = cloneData.organisation_id ? cloneData.organisation_id[0].id : null;
      }

      if(data.language && data.language.length > 0) {
        data.language = cloneData.language[0].name;
        data.language_code = cloneData.language[0].code;
      }

      if(data.language_to && data.language_to.length > 0) {
        data.language_to = cloneData.language_to[0].name;
        data.language_code_to = cloneData.language_to[0].code;
      }

      if(data.table_name === 'organisations' || data.table_name === 'projects') {
        if(data.volunteers.length > 0) {
          for(var i = 0; i < data.volunteers.length; i++) {
            data.volunteers[i] = cloneData.volunteers[i].id;
          }
        }
      }

      if(this.recordId) {
        // update instead
        let keys = [];
        for(var rKey in this.record) {
          keys.push(rKey);
        }

        for(var key in data) {
          if(keys.includes(key) === false) { //!this.record[key]
            delete data[key]
          }
        }

        this.updateRecord(data, this.recordId)
        return;
      }

      this.formActions.emit('close');
      this.mainService.showAlert('Submitting', 'Please wait...', 'load');
        this.mainService.submitForm(this.user, data)
        .subscribe((res: any) => {
          this.events.refreshSubject.next('refresh');
          this.mainService.close();
          this.mainService.showAlert('Submitted', 'Data has been successfully saved!', 'success');
          this.formActions.emit('reload');
        }, err => {
          this.mainService.close();
          this.mainService.showAlert('Failed', 'Saving Failed!', 'error');
        })
    }

    updateRecord(data, id) {
      this.formActions.emit('close');
      this.mainService.showAlert('Updating', 'Please wait...', 'load');
      this.mainService.updateEntry(this.user, data, id)
      .subscribe((res: any) => {
        this.events.refreshSubject.next('refresh');
        this.formActions.emit('reload');
        this.mainService.close();
        this.mainService.showAlert('Updated', 'Data has been successfully modified!', 'success');
      }, err => {
        this.mainService.close();
        this.mainService.showAlert('Failed', 'Updating Failed!', 'error');
      })
    }

    saveProject(data) {
      return new Promise((resolve, reject) => {
        let projectData = {
          table_name: 'projects',
          organisation_id: data.organisation_id,
          task: data.task,
          words: data.words,
          progress: 'In Progress',
          month: data.month,
          year: data.year,
          due: data.project_deadline,
          language: data.language,
          language_to: data.language_to,
          language_code: data.language_code,
          language_code_to: data.language_code_to,
          verified: true,
          volunteers: data.volunteer_id,
          date_created: data.date_created,
          date_updated: data.date_updated,
          added_by: this.user.id,
          status: 'active'
        }
        this.postProject(projectData)
        .then((res: any) => {
          resolve(res);
        }, err => {
          reject(err);
        })
      })
    }

   postProject(data: any) {
      return new Promise((resolve, reject) => {

      let cloneData = JSON.parse(JSON.stringify(data));
      if(data.table_name === 'projects') {
        data.organisation_id = cloneData.organisation_id ? cloneData.organisation_id[0].id : null;
      }

      if(data.language && data.language.length > 0) {
        data.language = cloneData.language[0].name;
        data.language_code = cloneData.language[0].code;
      }

      if(data.language_to && data.language_to.length > 0) {
        data.language_to = cloneData.language_to[0].name;
        data.language_code_to = cloneData.language_to[0].code;
      }

      if(data.table_name === 'organisations' || data.table_name === 'projects') {
        if(data.volunteers.length > 0) {
          for(var i = 0; i < data.volunteers.length; i++) {
            data.volunteers[i] = cloneData.volunteers[i].id;
          }
        }
      }

      this.mainService.showAlert('Creating project', 'Please wait...', 'load');
      this.mainService.submitForm(this.user, data)
      .subscribe((res: any) => {
        this.mainService.close();
        resolve(res);
      }, err => {
        this.mainService.close();
        this.mainService.showAlert('Failed', 'Project Saving Failed!', 'error');
        reject(err);
      })
    });
    }

    loadLanguages() {
      this.languages = LANGUAGES;
    }

}
