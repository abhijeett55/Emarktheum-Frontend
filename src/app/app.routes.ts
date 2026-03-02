import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Dashboard } from './component/dashboard/dashboard';
import { Create } from './component/create/create';
import { GAnnounce } from './component/g-announce/g-announce';
import { ProductDetails } from './component/product-details/product-details';
import { Explore } from './component/explore/explore';
import { Profile } from './component/profile/profile';
import { TransactionComponent } from './component/transaction/transaction';


export const routes: Routes = [
    { path: '', component:Dashboard},
];
