import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage, ref, uploadString, getDownloadURL } from '@angular/fire/storage';
import { TokenStorageService } from '../_services/token-storage.service';


const PRODUCT_API = 'http://localhost:8080/product';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

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
    public label: string ) {
  }
}

@Injectable({
  providedIn: 'root',
})


export class ProductService {

    constructor (
    private http: HttpClient,
    private storage: Storage,
    private tokenStorageService : TokenStorageService) { }

    create(label: string,
        title: string,
        location: string,
        surface: any,
        price: any,
        description: string,
        sold: boolean,
        verified: boolean,
        category: any,
        images: string[],
        sellerAddress: string
        ) : Observable <any> {

        return this.http.post(PRODUCT_API + '/create', {
            label,
            title,
            location,
            surface,
            price,
            description,
            sold,
            verified,
            category,
            images,
            sellerAddress
        }, httpOptions);
    }

    verify(id: string) {
        return this.http.post(PRODUCT_API+'/verify/'+id, {}, httpOptions);
    }

    reject(id: string) {
      return this.http.post(PRODUCT_API+'/sold/'+ id, {}, httpOptions);
    }

    getProducts() {
      return this.http.get<Product[]>(PRODUCT_API+'/allProducts');
    }

    getMyProducts() {
      return this.http.get<Product[]>(PRODUCT_API+'/user-products');
    }

    getProduct(id: string) {
      return this.http.get<Product>(PRODUCT_API+'/getProduct/'+ id);
    }

    isVerified() {
      return this.http.get<Product[]>(PRODUCT_API+'/isVerified');
    }

    isSold() {
      return this.http.get<Product[]>(PRODUCT_API+'/isSold');
    }

    getCategory() {
      return this.http.get<Category[]>(PRODUCT_API+'/category/getAll');
    }

    async subirImage(number: string, imgBase64: any) {
      try {
        const fileName = `${number}_${Date.now()}.png`;
        const storageRef = ref(this.storage, `uploads/${fileName}`);
        await uploadString(storageRef, imgBase64, 'data_url');
        return await getDownloadURL(storageRef);
      } catch (err) {
        console.log(err);
        return null;
      }
    }
}