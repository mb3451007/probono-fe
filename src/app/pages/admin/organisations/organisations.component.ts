import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { ModalComponent } from '../modal/modal.component';
import { MainService } from '../../../api/main.service';

declare interface TableData {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'organisations-table',
    moduleId: module.id,
    templateUrl: 'organisations.component.html'
})

export class OrganisationsComponent implements OnInit{
    public tableData: any[] = [];
    @Input() title: any;
    @Input() user: any;
    @Input() entries: any;
    @Input() entriesVolunteers: any;
    @Input() entriesOrganisations: any;
    @Input() entriesWords: any;
    @Input() entriesHours: any;
    @Input() entriesStars: any;
    @Input() entriesProjects: any;
    @Input() isSearching: boolean;
    @ViewChild('modal') private modalComponent: ModalComponent;
    modalConfig: ModalConfig = {
      id: '',
      modalTitle: 'Title',
      table: '',
      record: '',
      type: 'view',
      loadEntries: false,
      dismissButtonLabel: 'Submit',
      closeButtonLabel: 'Exit',
      animation: true,
      centered: true,
      container: 'admin-page'
    };
    @Input() page: number;
    @Input() itemsPerPage;
    @Input() totalItems: any;
    @Output() setPage = new EventEmitter<string>();
    @Output() setSortData =  new EventEmitter<string>();
    visibleEmails: boolean = false;
    emailsChosen: any[] = [];

    sortType: string = '';
    sortMode: string = 'desc';
    sortField: string = 'date_created';
    @Input() filter: string = "";

    constructor(
      private ref: ChangeDetectorRef,
      public mainService: MainService
    ) {
    }

    ngOnInit(){
      this.ref.markForCheck();
    //  this.page = 1;
    }

    addOrganisation() {
      this.openModal();
    }

    async openModal() {
      return await this.modalComponent.open();
    }

    // actions
    viewRecord(rec: any) {
      this.modalConfig.table = this.title;
      this.modalConfig.record = rec;
      this.modalConfig.type = 'view';
      this.openModal();
    }

    setNewPage(ev) {
      this.setPage.emit(ev);
    }

    editRecord(rec: any) {
      this.modalConfig.table = this.title;
      this.modalConfig.record = rec;
      this.modalConfig.type = 'edit';
      this.modalConfig.id = rec.id;
      this.openModal();
    }

    removeRecord(rec: any) {
      this.mainService.presentAlertDelete('Are you sure?', 'This record will be completely deleted.')
      .then((res: any) =>{
        if(res.isConfirmed) {
          // delete
          this.mainService.showAlert('Deleting', 'Please wait...', 'load');
          this.mainService.deleteRecord(this.user, rec.id, this.title)
          .subscribe((record: any) => {
            this.setNewPage(this.page);
            this.mainService.close();
            this.mainService.showAlert('Deleted!', 'The record has been successfully removed.', 'success');
          }, err => {
            this.mainService.close();
            this.mainService.showAlert('Failed!', 'The record has failed to be removed.', 'error');
          })
        }
      })
    }

    showEmails() {
      this.visibleEmails = !this.visibleEmails;
    }

    addIfCheckedOne(ev, rec) {
      if(ev.target.checked) {
        this.chooseEmail(rec);
      } else {
        rec['checked'] = false;
        this.emailsChosen = this.emailsChosen.filter(recs => recs !== rec);
      }
    }

    addIfCheckedAll(ev) {
      if(ev.target.checked) {
        this.chooseAllEmail();
      } else {
        this.emailsChosen = [];
        for(var i = 0; i < this.entriesVolunteers.length; i++) {
          delete this.entriesVolunteers[i].checked;
        }
      }
    }

    chooseEmail(rec) {
      rec['checked'] = true;
      this.emailsChosen.push(rec.email);
    }

    chooseAllEmail() {
      for(var i = 0; i < this.entriesVolunteers.length; i++) {
        if(this.emailsChosen.includes(this.entriesVolunteers[i].email) === false) {
          this.entriesVolunteers[i]['checked'] = true;
          this.emailsChosen.push(this.entriesVolunteers[i].email)
        }
      }
    }

    sortData(type) {
      this.sortType = type;
      if(this.sortMode === '' || this.sortMode === 'desc') {
        this.sortMode = 'asc';
      } else if(this.sortMode === 'asc') {
        this.sortMode = 'desc';
      }

      this.setSortData.emit(type);
    }


  convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
  }

 exportCSVFile(headers, items, fileTitle) {
    if (headers) {
      //  items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    console.log('got it', csv);
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator && (navigator as any).msSaveBlob) { // IE 10+
        (navigator as any).msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

 downloadVolunteers(){ // firstname, lastname, profile, proz_id, language, words
  var headers = {
      firstname: 'firstname', //.replace(/,/g, ''), // remove commas to avoid errors
      lastname: "lastname",
      profile: "profile",
      proz_id: "proz_id",
      language: "language",
      words: "words"
  };

  var itemsNotFormatted = this.entriesVolunteers;

  var itemsFormatted = [];

  // format the data
  itemsNotFormatted.forEach((item) => {
      let profArr = item.profile.split("/");
      let id = profArr.pop();

      itemsFormatted.push({
      //  firstname: item.first_name.replace(/,/g, ''), // remove commas to avoid errors
      //  lastname: item.last_name.replace(/,/g, ''),
      //  profile: item.profile.replace(/,/g, ''),
        proz_id: id,
        language: item.language ? item.language.replace(/,/g, '') : item.language,
        words: item.words,
        hours: item.hours == null ? 0 : item.hours
      });
  });

  var fileTitle = 'volunteers_csv'; // or 'my-unique-title'

  this.exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}

}
