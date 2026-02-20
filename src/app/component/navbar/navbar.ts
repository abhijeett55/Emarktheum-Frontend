import { Component , OnInit } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Web3Service } from '../../_services/web3.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
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

  constructor(
    private tokenStorageService : TokenStorageService,
    private web3: Web3Service,
    private router: Router ) {}

  async openMetaMask() {
  try {
    await this.web3.connectWallet();
    console.log('Wallet connected:', this.web3.getAddress());
    } catch (error) {
    console.error(error);
    }
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');

      this.username = user.username;
    }
  }

  logout() : void {
    this.tokenStorageService.signOut();
    window.location.reload();
    this.router.navigate(['/']);
  }
}
