import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../_services/auth';
import { TokenStorageService } from '../../_services/token-storage.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})


export class Login implements OnInit {
  form: {
    username:  string | null;
    password: string | null;
  } = {
    username : null,
    password: null
  };

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: Auth,
    private tokenStorage: TokenStorageService,
    private router: Router) { }
  ngOnInit(): void {
        if (this.tokenStorage.getToken()) {
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
        }
    }

    onSubmit(): void {
        const { username, password } = this.form;
        
        this.authService.login(username!, password!).subscribe({
            next: data => {
                this.tokenStorage.saveToken(data.accessToken);
                this.tokenStorage.saveUser(data);

                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.roles = this.tokenStorage.getUser().roles;
                alert("SignIn Successfull!");
                this.router.navigate(['/']);
            },
            error: err => {
                this.errorMessage = err.error.message || 'Login Failed';
                this.isLoginFailed = true;
            }
        });
        
    }
}
