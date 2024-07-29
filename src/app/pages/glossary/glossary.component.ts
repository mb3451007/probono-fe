import { Component, OnInit } from '@angular/core';
import { MainService } from '../../api/main.service';
import { AuthService } from '../../api/auth.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { LANGUAGES, CATEGORIES } from '../../../constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'glossary-cmp',
    moduleId: module.id,
    templateUrl: 'glossary.component.html'
})

export class GlossaryComponent implements OnInit{
    public glossaryItems: any[] = [];
    isLoading: boolean = false;
    user: any = {token: 'none'};
    error: any;
    page: number = 1;
    itemsPerPage = 10;
    totalItems: any;
    isSearching: boolean = false;
    sortType: string = '';
    sortMode: string = 'asc';
    sortField: string = 'source_text';
    loginForm: FormGroup;
    commentForm: FormGroup;
    termForm: FormGroup;
    showLogin: boolean = false;
    dropdownSettingsLanguages:IDropdownSettings = {
      singleSelection: true,
      idField: 'code3',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowRemoteDataSearch: false,
      noDataAvailablePlaceholderText: 'No match.',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    dropdownSettingsCats:IDropdownSettings = {
      singleSelection: true,
      idField: 'value',
      textField: 'label',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 8,
      allowRemoteDataSearch: false,
      noDataAvailablePlaceholderText: 'No match.',
      allowSearchFilter: true,
      closeDropDownOnSelection: true
    };
    languages: any[] = LANGUAGES;
    categories: any[] = CATEGORIES;
    showTermsForm: boolean = false;
    is_submitting: boolean = false;
    submittingText: string = "";
    termFormSteps: any[] = ['src', 'target', 'submit'];
    activeStep: string = 'src';
    termId: any;
    viewMode: string = 'multiple';
    term: any;
    showCommentForm: boolean = false;
    comments: any[] = [];
    buttonClicked: boolean = false;

    constructor(
      public mainService: MainService,
      public authService: AuthService,
      public formBuilder: FormBuilder,
      public route: ActivatedRoute,
      public router: Router
    ) {

      this.route.params
      .subscribe((params: any) => {
        if(params && params.id) {
          this.termId = params.id;
          this.viewMode = 'single';
          this.loadSingleTerm();
          this.loadComments();
        }
      });
    }

    ngOnInit(){
      this.user = this.authService.getData('user');
      console.log('user', this.user);
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });

      if(this.viewMode === 'multiple') {
        this.fetchEntries('glossary');
      }

      if(this.user) {
        this.runTermForm();

        if(this.viewMode === 'single') {
          this.loadCommentsForm();
        }
      }
    }

    loadCommentsForm() {
      this.commentForm = this.formBuilder.group({
        table_name: ['comments'],
        user_id: [this.user?.id],
        term_id: [this.termId],
        description: ['', Validators.required],
        type: ['human'],
        status: ['active'],
        date_created: [moment().format("YYYY-MM-DD HH:mm:ss")],
        date_updated: [moment().format("YYYY-MM-DD HH:mm:ss")],
      });
      this.showCommentForm = true;
    }

    async sendComment(data) {
      console.log('comment', data);

      let subData = JSON.parse(JSON.stringify(data));
      console.log('log final', subData);
      this.is_submitting = true;
      this.submittingText = 'Submitting to glossary';
      let submitted = await this.saveData(subData);
      console.log('sub', submitted);
      this.is_submitting = false;
      this.submittingText = "Term successfully submitted!";

      setTimeout(() => {
        this.submittingText = "";
        this.showTermsForm = false;
      }, 3000);
    }

    openTerm(term) {
      this.router.navigate(['/glossary/' + term.id]);
    }

    async loadSingleTerm() {
      return new Promise((resolve, reject) => {
        this.isLoading = true;
        this.mainService.getEntriesBySelectors(this.user, 'glossary', JSON.stringify({'glossary.id': this.termId}), 1, 1, 'glossary.date_created', 'desc')
        .subscribe((res: any) => {
          console.log('got term', res);
          this.term = res?.entries?.length > 0 ? res?.entries[0] : null;
          this.isLoading = false;
          resolve(this.term);
        }, err => {
          console.log('err', err);
          this.error = err;
          this.isLoading = false;
          reject(err);
        })
      })
    }

    loadComments() {
      return new Promise((resolve, reject) => {
        this.isLoading = true;
        this.mainService.getEntriesBySelectors(this.user, 'comments', JSON.stringify({'comments.term_id': this.termId}), 10, 1, 'comments.date_created', 'asc')
        .subscribe((res: any) => {
          console.log('got comments', res);
          this.comments = res?.entries?.length > 0 ? res?.entries : [];
          this.isLoading = false;
          resolve(this.comments);
        }, err => {
          console.log('err', err);
          this.error = err;
          this.isLoading = false;
          reject(err);
        })
      })
    }

    runTermForm() {
      this.termForm = this.formBuilder.group({
        table_name: ['glossary'],
        user_id: [this.user?.id],
        source: [[{code3: 'eng', name: 'English'}], ],
        source_text: [''],
        target: [[{code3: 'spa', name: 'Spanish'}],],
        target_text: [''],
        field: [''],
        type: ['general'],
        verified: [true],
        date_created: [moment().format("YYYY-MM-DD HH:mm:ss")],
        date_updated: [moment().format("YYYY-MM-DD HH:mm:ss")],
        added_by: [this.user?.id],
        status: ['active'],
      });
    }

    showLoginForm() {
      this.showLogin = true;
    }

    nextStep() {
      let i = this.termFormSteps.findIndex(step => this.activeStep === step);
      this.activeStep = this.termFormSteps[i + 1];
    }

    addTerms() {
      this.runTermForm();
      this.showTermsForm = true;
      this.activeStep = 'src';
    }

    editTerm(term, verify) {
      if(verify === 'all') {
        // all
      }

      if(verify === true) {
        // set tot ru
      }

      if(verify === false) {
        // unverify
      }
    }

    deleteTerm(term) {
      this.mainService.presentAlertDelete('Are you sure?', 'This term will be completely deleted.')
      .then((res: any) =>{
        if(res.isConfirmed) {
          // delete
          this.mainService.showAlert('Deleting', 'Please wait...', 'load');
          this.mainService.deleteRecord(this.user, term.id, 'glossary')
          .subscribe((record: any) => {
            // this.glossaryItems = [];
            this.loadPage(this.page)
            this.mainService.close();
            this.mainService.showAlert('Deleted!', 'The term has been successfully removed.', 'success');
          }, err => {
            this.mainService.close();
            this.mainService.showAlert('Failed!', 'The term has failed to be removed.', 'error');
          })
        }
      })
    }

    login(data) {
      console.log('data', data);
      this.mainService.showAlert('Logging you in', 'Please wait...', 'load');
      this.authService.doLogin(data.email, data.password)
      .subscribe((res: any) => {
        res['access_token'] = res.token;
        this.authService.setData('authToken', res);

        // to remove
        this.user = res;
        this.authService.setData('user', this.user);
        this.mainService.close();

        /*
        this.authService.getUserInfo()
        .subscribe((user: any) => {
          let id = Number(user.profile.split("/").pop());
          this.user = {...user, ...res, id: id};
          console.log('user', this.user);
          this.authService.setData('authToken', {...res, id: id});
          this.authService.setData('user', this.user);
          this.mainService.close();
        })
        */
      }, (err: any) => {
        this.mainService.close();
        console.log('failed to log in', err);
        this.mainService.showAlert('Logging in failed!', err ? err.error.message : 'Check your internet try again later.', 'error');
      })
    }

    async likeTerm(term, state) {
      this.buttonClicked = true;

      if(!this.user) {
        this.mainService.showAlert("Logged Out!", "You have to be logged in to upvote or downvote", "error");
        this.buttonClicked = false;
        return;
      }

      // if current user, instead delete your choice!
      if(term.voted) {
        // mismatch
        let message = "";
        if(!state && term.votedType === 'up') {
          message = "You have already up-voted this term. Undo the vote before down-voting";
        }

        if(state && term.votedType === 'down') {
          message = "You have already down-voted this term. Undo the vote before up-voting";
        }

        if(message !== '') {
          this.mainService.showAlert("Already voted!", message, "warning");
          this.buttonClicked = false;
          return;
        }

        if((state && term.votedType === 'up') || (!state && term.votedType === 'down')) {
          // remove the vote;
          this.mainService.deleteRecord(this.user, term.vote_id, 'votes')
          .subscribe((record: any) => {
            console.log('removed vote', record);
            console.log('or', term);

            term.voted = 0;
            term.vote_id = null;
            term.votedType = null;

            if(state) term.likes -= 1;
            if(!state) term.dislikes -= 1;
            this.buttonClicked = false;
          }, err => {
            console.log('err', err);
            this.buttonClicked = false;
          });
          return;
        }
      }

      let body = {
        table_name: 'votes',
        user_id: this.user?.id,
        term_id: term.id,
        type: state ? 'up' : 'down',
        date_created: moment().format("YYYY-MM-DD HH:mm:ss"),
        status: 'active'
      };

      let vote: any = await this.saveData(body);

      term.voted = 1;
      term.vote_id = vote?.id;
      term.votedType = vote?.type;

      if(state) term.likes += 1;
      if(!state) term.dislikes += 1;
      this.buttonClicked = false;
    }

    async submitTerm(data) {
      //console.log('to submit', data);
      let subData = JSON.parse(JSON.stringify(data));
      subData.source = data.source[0].code3;
      subData.target = data.target[0].code3;
      subData.field = data.field[0].value;

      this.is_submitting = true;
      this.submittingText = 'Submitting to glossary';

      try {
        let submitted = await this.saveData(subData);
        this.is_submitting = false;
        this.submittingText = "Term successfully submitted!";
      } catch(e) {
        this.is_submitting = false;
        this.submittingText = "Term failed to submit!";
      }

      setTimeout(() => {
        this.submittingText = "";
        this.showTermsForm = false;
      }, 3000);
    }

    saveData(data: any) {
      return new Promise((resolve, reject) => {
        this.mainService.submitForm(this.user, data)
        .subscribe((res: any) => {
          resolve(res.entry[0] || {});
        }, err => {
          console.log('err', err);
          reject(err);
        })
      });
    }

    async loadPage(ev) {
      this.isSearching = true;
      this.page = ev;
      await this.fetchEntries('glossary');
      this.isSearching = false;
    }

    fetchEntries(table: string): Promise<any[]> {
      this.isLoading = true;
      return new Promise<any[]>((resolve, reject) => {
        this.mainService.getEntriesBySelectors(this.user, table, JSON.stringify({'glossary.type': 'general'}), this.itemsPerPage, this.page, 'glossary.date_created', 'desc')
        .subscribe((res: any) => {
          console.log('got', res);
          this.isLoading = false;
          this.glossaryItems = res.entries;
          this.totalItems = res.total_count || res?.entries?.length;
          resolve(this.glossaryItems);
        }, err => {
          console.log('err', err);
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
      await this.fetchEntries('glossary');
      this.isSearching = false;
    }

    searchFor(ev) {
      let string = ev.target.value;
      this.search('glossary', string);
    }

    search(table, searchstring) {
      let key = 'name';
      this.isSearching = true;
      this.mainService.search(this.user, table, key, searchstring, this.itemsPerPage)
      .subscribe((res: any) => {
        this.glossaryItems = res.entries;
        this.totalItems = res?.entries?.length;
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
        this.sortField = 'glossary.title';
      }

      if(this.sortType === 'words') {
        this.sortField = 'words';
      }

      await this.fetchEntries('glossary');
      this.isSearching = false;
    }
}
