import { Injectable } from '@angular/core';


export class Product {
  constructor(public id: string,
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
  constructor(public id: string,
    public label: string ) {

  }
}

@Injectable({
  providedIn: 'root',
})


export class ProductService {
    constructor(private httpClient: HttpClient,
      private storage : Storage,
      private tokenStorageService : TokenStorageService) {
    }

    async subirImage(number: string, imgBase64: any) {
      try {
        const filePath = ;
        return await getDownloadURL(storageRef);
      } catch (err) {
        console.log(err);
        return null;
      }
    }
}