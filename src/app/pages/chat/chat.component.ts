import { Component, OnInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
import { $ } from 'protractor';
import { MainService } from '../../api/main.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'chat-cmp',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  card1=[
    {name:'ex2 (3)nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn', path:'http://localhost:8080/resources/files/ex1.txt'},
  ]
  card2=[
    {name:'Gray Gold Clean CV Resume',path:'http://localhost:8080/resources/files/ex1.txt'}
  ]
  card3=[
    {name:'EX3nnnnnnnnnnn', path:'http://localhost:8080/resources/files/ex1.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
  ]
  uploadedFile:any

  constructor(private MainService:MainService, private http: HttpClient) {
    
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
  }

  onFileSelected(event: Event, panel: string): void {
    const formData = new FormData();
    const input = event.target as HTMLInputElement;
    let file:any

    if (input.files && input.files.length > 0) {
      file = input.files[0];
    }
    formData.append('hub_id','123')
    formData.append('file_uploaded', file, file.name)
    formData.append('panel',panel)
    formData.append('uploaded_by','ABC')

    console.log ('formdata', formData.get('hub_id'))
    console.log ('formdata', formData.get('file_uploaded'))
    console.log ('formdata', formData.get('panel'))
    console.log ('formdata', formData.get('uploaded_by'))

    this.uploadedFile={
      hub_id: '123',
      file_uploaded: file.name,
      panel: panel,
      uploaded_by: 'ABC'
    }

    console.log('uploaded file', this.uploadedFile)

    this.MainService.uploadFiles(formData).subscribe((response)=>{
      console.log(response, "this is api responce");
    })
    input.value = '';

    this.saveFileToDB(this.uploadedFile)
  }

  saveFileToDB(file: any){
    this.MainService.saveFile(file).subscribe((response)=>{
      console.log(response, "this is api responce");
    })
  }

  // sendFile(){
  //   console.log ('formdata', this.formData.get('hub_id'))
  //   console.log ('formdata', this.formData.get('file_uploaded'))
  //   console.log ('formdata', this.formData.get('panel'))
  //   console.log ('formdata', this.formData.get('uploaded_by'))

  //   this.MainService.uploadFiles(this.formData).subscribe((response)=>{
  //     console.log(response, "this is api responce");
  //   })
  //   this.formData=new FormData()
  // }

  downloadFile(){
    this.http.get(this.card1[0].path, { responseType: 'blob' }).subscribe((response: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(response);
      a.href = objectUrl;
      a.download = this.card1[0].name; // replace with your desired file name
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
