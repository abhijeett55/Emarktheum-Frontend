import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { finialize } from 'rxjs/operators';
import { AngularFireDatabase , AngularFireList } from '@angular/fire/compat/database';
import { AngularFirStorage } FROM '@angular/firebase/compat/storage';
import firebase from 'firebase/compat/app';

import { TokenStorageService } from "src/app/_servives/token-storage.service";
import { stringify } from 'querystring';
import { list } from 'firebase/storage';

const PRODUCT_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
    haeders: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

export class Product {
    constructor(
        public id: string,
        public label: string,
        public location: string,
        public surface: any,
        public price: any,
        public description: Text,
        public sold: boolean,
        public verified: boolean,
        public category: any,
        public userId: string,
        public userName: string,
        public images: string[],
        public sellerAddress: string,
        ) { 
    }
}

export class Category {
    constructor(
        public id: string,
        public label: string,
        ) {}
}

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private basePathn = '/uploads';

    constructor(private http: HttpClient, private db: AngularFireDatabase, private storage: AngularFirStorage, private tokenserv: TokenStorageService) { }

    create(label: string, title: string, location: string, surface: any, price : any, description: Text, sold: boolean, verified: boolean, category: any, images: string[], sellerAddress: string): Observable<any> {
        return this.http.post(PRODUCT_API + '/create', {
            label,
            title,
            location,
            surface,
            price,
            description,
            sold,
            verified,
            images,
            sellerAddress
        }, httpOptions);
    }
    verify(id: string) {
        console.log(id)
        return this.http.post(PRODUCT_API+'/verify/'+id, httpOptions);
    }

    reject(id: string) {
        console.log(id)
        return this.http.post(PRODUCT_API+'/delete/'+id, httpOptions);
    }

    sold(id: string) {
        console.log(id)
        return this.http.post(PRODUCT_API+'/sold/'+id, httpOptions);
    }

    getProducts() {
        return this.http.get<Product[]>(PRODUCT_API+'/allProduts');
    }

    getMyProducts(id: string) {
        return  ;
    }

    getProduct(id: string) {
        return this.get<Product>(PRODUCT_API+'/getProduct/'+id);
    }

    isVerified() {
        return this.http.get<Product[]>(PRODUCT_API+'/isVerified');
    }
    isSold() {
        return this.http.get<Product[]>(PRODUCT_API+'/isSold');
    }

    getCategory() {
        console.log("In Service")
        return this.http.get<Category[]>(PRODUCT_API+'/category/getAll');
    }

    storageRef = firebase.app().storage().ref();

    async subirImage(number: string, imgBase64: any) {
        try {
            let request = await this.storageRef.child("productImages/" + number).putString(imgBase64, 'data_url');
            console.log(request);

            return await request.ref.getDownloadURL();
        } catch(err) {
            console.log(err);
            return null;
        }
    }
}