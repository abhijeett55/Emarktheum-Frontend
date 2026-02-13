import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
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
  isLoggedFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router ) {

  }
  ngOnInit(): void {
        if (this.tokenStorage.getToken()) {
            this.isLoggedIn = true;
            this.roles = this.tokenStorage.getUser().roles;
        }
    }

    onSubmit(): void {
        const { username, password } = this.form;
        
        this.authService.login(username, password).subscribe({
            next: data => {
                this.tokenStorage.saveToken(data.accessToken);
                this.tokenStorage.saveUser(data);

                this.isLoginFailed = false;
                this.isLoggedIn = true;
                this.roles = this.tokenStorage.getUser().roles;
                this.relodPage();
            },
            error: err => {
                this.errorMessage = err.error.message;
                this.isLoginFailed = true;
            }
        });
        alert("SignIn Successfull!")
        this.router.navigate(['/']);
    }


    relodPage(): void {
        window.location.reload();
    }
}
