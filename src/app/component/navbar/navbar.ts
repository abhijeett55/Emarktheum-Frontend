import { Component , OnInit } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Web3 } from '../../_services/web3';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-navbar',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})


export class Navbar implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username?: string;
  router: any;

  constructor(private tokenStorageService : TokenStorageService,
    private web3: Web3 ) {}


  openMetaMask() {
    this.web3.logimsk().then(resp => {
      console.log(resp);
    })
  }

  ngOnInit(): void {``
    this.isLoggedIn = !this.tokenStorageService.getToken();

    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');

      this.username = user.username;
    }
  }
}
