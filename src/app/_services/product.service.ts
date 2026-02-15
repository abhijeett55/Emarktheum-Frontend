import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Storage , ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { TokenStorageService } from './token-storage.service';

const PRODUCT_API = 'http://localhost:8080/api/auth';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type' : 'application/json' })
}

export class Product {
    constructor(
        public id: string,
        public label: string,
        public location: string,
        public surface: any,
        public price: any,
        public description: string,
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
    private basePath = '/uploads';

    constructor(private http: HttpClient,
        private storage: Storage,
        private tokenserv: TokenStorageService)
    { }

    create(label: string, title: string, location: string, surface: any, price : any, description: string, sold: boolean, verified: boolean, category: any, images: string[], sellerAddress: string): Observable<any> {
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
        return this.http.post(PRODUCT_API+'/verify/'+id,{}, httpOptions);
    }

    reject(id: string) {
        console.log(id)
        return this.http.post(PRODUCT_API+'/delete/'+id, {}, httpOptions);
    }

    sold(id: string) {
        console.log(id)
        return this.http.post(PRODUCT_API+'/sold/'+id, {}, httpOptions);
    }

    getProducts() {
        return this.http.get<Product[]>(PRODUCT_API+'/allProducts');
    }

    getMyProducts(id: string) {
        return  this.http.get<Product[]>(PRODUCT_API+'/myProducts/'+id);
    }

    getProduct(id: string) {
        return this.http.get<Product>(PRODUCT_API+'/getProduct/'+id);
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


    async subirImage(number: string, imgBase64: any) {
    try {
        const filePath = `productImages/${number}`;
        const storageRef = ref(this.storage, filePath);

        await uploadString(storageRef, imgBase64, 'data_url');

        return await getDownloadURL(storageRef);
        } catch (err) {
        console.log(err);
        return null;
        }
    }
}