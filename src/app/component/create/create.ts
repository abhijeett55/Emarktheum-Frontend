import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ProductService , Category } from '../../_services/product';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})


export class Create implements OnInit {
  form: any = {
    file: null,
    label: null,
    title: null,
    category: { id : null },
    location: null,
    price: null,
    surface: null,
    description: null
  };

  isSuccessfull = false;
  errorMessage = '';
  cats!: Category[];
  img0!: any;
  img1!: any;
  img2!: any;
  img3!: any;
  sellerAd!: any;


  constructor() { }


}
