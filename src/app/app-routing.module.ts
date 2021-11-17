import { AssetDetailsComponent } from './pages/asset-details/asset-details.component';
import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

import { AppController } from './app.controller';
import { HomeComponent } from './core/components/home/home.component';
import { ConnectWalletComponent } from './pages/connect-wallet/connect-wallet.component';
import { routerConfig } from './core/config/router-config.const';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { AboutComponent } from './pages/about/about.component';
import { AssetsComponent } from './pages/assets/assets.component';
import { ContactComponent } from './pages/contact/contact.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { CreatorsComponent } from './pages/creators/creators.component';
import { MyAssetsComponent } from './pages/my-assets/my-assets.component';
import { MintComponent } from './pages/mint/mint.component';
import { FAQComponent } from './pages/faq/faq.component';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  {
    path: 'demo',
    component: HomeComponent,
    data: {
      title: AppController.trans().home
    }
  },
  {
    path: '',
    component: LandingComponent,
    data: { showHeader: false }
  },
  {
    path: 'connect-wallet',
    component: ConnectWalletComponent
  },
  {
    path: 'authentication',
    component: AuthenticationComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'assets',
    component: AssetsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'profile',
    component: UserDashboardComponent
  },
  {
    path: 'creators',
    component: CreatorsComponent
  },
  {
    path: 'details/:asset/:auction',
    component: AssetDetailsComponent
  },
  // {
  //   path: 'my-assets',
  //   component: MyAssetsComponent
  // },
  {
    path: 'mint',
    component: MintComponent
  },
  {
    path: 'faq',
    component: FAQComponent
  },
  {
    path: routerConfig.users.base,
    loadChildren: () => import('./lazy/users/users.module').then(mod => mod.UsersModule)
  }
];
const routerOptions: ExtraOptions = {
  useHash: false,
  anchorScrolling: 'enabled',
};
@NgModule({
  
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
