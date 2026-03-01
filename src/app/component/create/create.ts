import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService , Category } from '../../_services/product';
import { Router } from '@angular/router';
import { Web3Service } from '../../_services/web3.service';
import { TokenStorageService } from '../../_services/token-storage.service';



@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule ],
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
    description: null,
  };

  isSuccessfull = false;
  errorMessage = '';
  cats!: Category[];
  img0!: any;
  img1!: any;
  img2!: any;
  img3!: any;
  sellerAd!: any;


  constructor(private productservice: ProductService,
    private router: Router, private web3: Web3Service,
    private tokenserv: TokenStorageService
    ) { }


  async ngOnInit() : Promise<void> {
    await this.web3.connectWallet()
    console.log(this.web3.account)
    this.getCategories()
  }

  getCategories() {
    this.productservice.getCategory().subscribe( data => {
      this.cats = data;
      console.log(data);
    });
  }

  changeCat(event: any) {
    this.form.category.id = event.target.value.substr(3);
    console.log(event.target.value.substr(3))
  }


  onSubmit() : void {
    const {label , title, category, location, price, surface, description } = this.form;
    this.img0 = window.sessionStorage.getItem("img0");
    this.img1 = window.sessionStorage.getItem("img1");
    this.img2 = window.sessionStorage.getItem("img2");
    this.img3 = window.sessionStorage.getItem("img3");
    

    this.sellerAd = this.web3.account;
    


    this.productservice.create(label, title, location, surface, price, description, false, false, category, [this.img1, this.img2, this.img3],this.sellerAd)
    .subscribe({
        next: data => {
          console.log(data);
          this.isSuccessfull = true;
          alert("product added successfully, the admin will verify it soon, thank you!")
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSuccessfull = false;
        }
      });
  }


F!:string;
listF!: any[];

images: any[] = [];

cargarImagen(event: any) {
  let archivos = event.target.files;
  let nombre = "product";


  for(let i = 0; i < archivos.length; i++) {
    const reader = new FileReader();

    reader.readAsDataURL(archivos[i]);

    reader.onloadend = () => {
      console.log(reader.result);
      this.images.push(reader.result);


      this.productservice
      .subirImage(nombre + " " + Date.now(), reader.result)
      .then((urlImagen: any) => {
        if(urlImagen) {
          window.sessionStorage.setItem("img" + i, urlImagen);
        }
      });
      
    };
  }
}


}
