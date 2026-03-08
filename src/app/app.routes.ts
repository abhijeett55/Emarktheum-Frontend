import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Login } from './component/login/login';
import { Dashboard } from './component/dashboard/dashboard';

import { GAnnounce } from './component/g-announce/g-announce';
import { ProductDetails } from './component/product-details/product-details';
import { Profile } from './component/profile/profile';
import { Register } from './component/register/register';
import { Market } from './component/market/market';

import { TransactionComponent } from './component/transaction/transaction';

import { RoleGuard } from './_services/role.guard';
import { ErrorGuard } from './_services/error.guard';
import { TokenStorageGuard } from './_services/token-storage.guard';


export const routes: Routes = [
    { path: '', component:Dashboard},
    { path: 'product-details/:id', component: ProductDetails },

  { path: 'transactions', component: TransactionComponent, canActivate: [RoleGuard] },

  { path: 'explore/product-details/:id', component: ProductDetails },

  { path: 'login', component: Login, canActivate: [ErrorGuard] },
  { path: 'register', component: Register, canActivate: [ErrorGuard] },

  { path: 'profile', component: Profile, canActivate: [TokenStorageGuard] },

  { path: 'g-announce', component: GAnnounce, canActivate: [RoleGuard] },

  { path: 'market', component: Market },


  { path: '**', redirectTo: '' }
];
