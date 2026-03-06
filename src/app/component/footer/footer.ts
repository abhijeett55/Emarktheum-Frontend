import { Component , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {

  userCountry : string = "Loading...";
  userLanguage: string = "English";
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const language = navigator.language;
    if(language.startsWith('hi')) this.userLanguage = "English";
    else if(language.startsWith('fr')) this.userLanguage = "English";
    else if(language.startsWith('es')) this.userLanguage = "Englis";
    else this.userLanguage = "English";


    this.http.get<any>('https://ipapi.co/json/')
      .subscribe(data => {
        this.userCountry = data.country_name;
      }, error => {
        this.userCountry = "India";
      });
  }

  


 

}
