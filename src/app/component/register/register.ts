import { Component, OnInit } from '@angular/core';
import { Auth } from '../../_services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule , FormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements  OnInit {
  form: {
    username: string | null;
    email: string | null;
    password: string | null;
    confirmpassword: string | null;
  } = {
    username: null,
    email : null,
    password : null,
    confirmpassword : null
  };


  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private auth: Auth, private router : Router) {
  }

  ngOnInit() : void {

  }

  async onSubmit() : Promise<void> {
    const { username , email, password, confirmpassword } = this.form;

    if(!username || !email || !password || !confirmpassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (password !== confirmpassword) {
      this.errorMessage = "Passwords do not match";
      this.isSignUpFailed = true;
      return;
  }


    this.auth.register(username,email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;

        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Registration Failed';
        this.isSignUpFailed = true;
      }
    });
  }
}
