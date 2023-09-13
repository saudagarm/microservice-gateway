import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { VERSION } from 'app/app.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  paymentEntityNavbarItems: any[] = [];
  collectionEntityNavbarItems: any[] = [];
  masterEntityNavbarItems: any[] = [];
  cardsEntityNavbarItems: any[] = [];

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      import('payment/entity-navbar-items').then(
        ({ EntityNavbarItems: PaymentEntityNavbarItems }) => {
          this.paymentEntityNavbarItems = PaymentEntityNavbarItems;
        },
        error => {
          // eslint-disable-next-line no-console
          console.log('Error loading payment entities', error);
        }
      );
      import('collection/entity-navbar-items').then(
        ({ EntityNavbarItems: CollectionEntityNavbarItems }) => {
          this.collectionEntityNavbarItems = CollectionEntityNavbarItems;
        },
        error => {
          // eslint-disable-next-line no-console
          console.log('Error loading collection entities', error);
        }
      );
      import('master/entity-navbar-items').then(
        ({ EntityNavbarItems: MasterEntityNavbarItems }) => {
          this.masterEntityNavbarItems = MasterEntityNavbarItems;
        },
        error => {
          // eslint-disable-next-line no-console
          console.log('Error loading master entities', error);
        }
      );
      import('cards/entity-navbar-items').then(
        ({ EntityNavbarItems: CardsEntityNavbarItems }) => {
          this.cardsEntityNavbarItems = CardsEntityNavbarItems;
        },
        error => {
          // eslint-disable-next-line no-console
          console.log('Error loading cards entities', error);
        }
      );
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
