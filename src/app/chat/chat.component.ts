import { Component, OnInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
import { $ } from 'protractor';

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


  ngAfterViewInit(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
  }
}
