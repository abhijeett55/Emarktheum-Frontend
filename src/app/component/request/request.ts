import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request.html',
  styleUrl: './request.scss',
})


export class Request implements OnInit {
  constructor() { }
  ngOnInit(): void {

  }
}
