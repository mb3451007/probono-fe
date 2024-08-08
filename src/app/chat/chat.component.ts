import { Component, OnInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
import { $ } from 'protractor';
import { MainService } from '../api/main.service';

@Component({
  selector: 'chat-cmp',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  card1=[
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
    {name:'EX1', path:'/assets/files/card1/ex1.txt'},
  ]
  card2=[
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
    {name:'EX2', path:'/assets/files/card2/ex2.pdf'},
  ]
  card3=[
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
    {name:'EX3', path:'/assets/files/card3/ex3.txt'},
  ]


  constructor(private MainService:MainService) {
    
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
  }

  onFileSelected(event: Event, panel: string): void {
    const input = event.target as HTMLInputElement;
    let file:any

    if (input.files && input.files.length > 0) {
      file = input.files[0];
      console.log('Selected file:', file.name);
    }

    const uploadedFile={
      hub_id: '123',
      file_uploaded: file.name,
      panel: panel,
      uploaded_by: 'ABC'
    }

    console.log('uploaded file', uploadedFile)

    this.MainService.uploadFiles(uploadedFile).subscribe((response)=>{
      console.log(response, "this is api responce");
      
    })
  }
}
