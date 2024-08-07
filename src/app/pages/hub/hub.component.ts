import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { log } from 'console';

@Component({
    selector: 'hub-cmp',
    moduleId: module.id,
    templateUrl: 'hub.component.html',
    styleUrls: ['hub.component.scss'],
    animations: [
        trigger('fadeIn', [
          state('void', style({ opacity: 0 })),
          transition('void => *', [
            animate('0.4s ease-in')
          ])
        ]),
        trigger('slideOut', [
            transition(':leave', [
              style({ transform: 'translateX(0)', opacity: 1 }),
              animate(
                '500ms ease-in',
                style({ transform: 'translateX(-100%)', opacity: 0 })
              )
            ])
          ])
      ]
})

export class HubComponent{
    form: FormGroup;
    delIcon=false
    renderer: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
        translators: this.fb.array([]),
        RevName: new FormControl('', Validators.required),
        RevEmail: new FormControl('', [Validators.required, Validators.email])
      });

    this.addTranslatorForm()
  }

 


  addTranslatorForm(): void {
    const translatorGroup = this.fb.group({
        transName: ['', Validators.required],
        transEmail: ['', [Validators.required, Validators.email]]
      });
      this.translators.push(translatorGroup);
      if (this.translators.controls.length > 1) {
        this.delIcon = true;
      }
  }



  get translators() {
    return this.form.get('translators') as FormArray;
  }

  deleteTranslatorForm(ind:number){
    this.translators.removeAt(ind);
    if(this.translators.controls.length==1)
        this.delIcon=false
  }

  onSave(){
    console.log(this.form.value);
    let transName=[]
    let transEmail=[]
    for (let index = 0; index < this.form.value.translators.length; index++) {
      transName.push(this.form.value.translators[index].transName) ;
      transEmail.push(this.form.value.translators[index].transEmail) ;
    }
    const receivedData={
      revName: this.form.value.RevName,
      revEmail: this.form.value.RevEmail,
      transName: transName.join(','),
      transEmail: transEmail.join(','),
    }

    console.log(receivedData)
  }

    

}