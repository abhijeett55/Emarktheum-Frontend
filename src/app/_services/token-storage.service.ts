import { Injectable, inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})

export class TokenStorageService {
    private platformId = inject(PLATFORM_ID);

    private isBrowser(): boolean {
        return isPlatformBrowser(this.platformId);
    }
    public signOut(): void {
        if (this.isBrowser()) {
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
        }
    }

    public saveToken(token: string): void {
          if (this.isBrowser()) {
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.setItem(TOKEN_KEY, token);
        }
    }

    public getToken(): string | null {
       if (this.isBrowser()) {
        return sessionStorage.getItem(TOKEN_KEY);
        }
        return null;
    }

    public isLoggedin() {
        return this.getToken() !== null;
    }

    public saveUser(user: any): void {
       if (this.isBrowser()) {
            sessionStorage.removeItem(USER_KEY);
            sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        }   
    }

    public getUser(): any {
        if (this.isBrowser()) {
            const user = sessionStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : {};
        }
        return {};
    }

    public getUserId(): String | null {
        const user = this.getUser();

        return user?.id ?? null;
    }

}                     