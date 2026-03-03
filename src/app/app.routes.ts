import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Login } from './component/login/login';
import { Dashboard } from './component/dashboard/dashboard';
import { Create } from './component/create/create';
import { GAnnounce } from './component/g-announce/g-announce';
import { ProductDetails } from './component/product-details/product-details';
import { Explore } from './component/explore/explore';
import { Profile } from './component/profile/profile';
import { Register } from './component/register/register';
import { TransactionComponent } from './component/transaction/transaction';

import { RoleGuard } from './_services/role.guard';
import { ErrorGuard } from './_services/error.guard';
import { TokenStorageGuard } from './_services/token-storage.guard';


export const routes: Routes = [
    { path: '', component:Dashboard},
    { path: 'create', component: Create, canActivate: [TokenStorageGuard ]},
    { path: 'product-details/:id', component: ProductDetails },

  { path: 'transactions', component: TransactionComponent, canActivate: [RoleGuard] },

  { path: 'explore', component: Explore },
  { path: 'explore/product-details/:id', component: ProductDetails },

  { path: 'login', component: Login, canActivate: [ErrorGuard] },
  { path: 'register', component: Register, canActivate: [ErrorGuard] },

  { path: 'profile', component: Profile, canActivate: [TokenStorageGuard] },

  { path: 'g-announce', component: GAnnounce, canActivate: [RoleGuard] },

  { path: '**', redirectTo: '' }
];
