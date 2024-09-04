import { Component, inject, OnInit } from '@angular/core';
import { IsPremiumComponent } from '../ui/alerts/is-premium/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UserSubscriptionService } from '../services/user-subscription.service';
import { UserSettingsService } from '../services/user-settings.service';
import { Observable, tap } from 'rxjs';
import { UserSettings } from '../interfaces/user-settings';
import { AsyncPipe, NgIf } from '@angular/common';
import { UserSubscription } from '../interfaces/user-subscription';

@Component({
  selector: 'app-referrals',
  standalone: true,
  imports: [
    IsPremiumComponent,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './referrals.component.html',
  styleUrl: './referrals.component.scss'
})
export class ReferralsComponent implements OnInit {
  private userSubscriptionService = inject(UserSubscriptionService);
  private userSettingsService = inject(UserSettingsService);

  userSubscription$ = this.userSubscriptionService.subscription$;
  referries: UserSubscription[] = [];
  referries$ = this.userSubscriptionService.referries();

  base = 'https://web.whatsapp.com/send?text=';
  tgBase = 'https://t.me/share/url?';
  text = `¿Qué esperas para formar parte de la revolución educativa del siglo? 🌟

Regístrate en KitMaestro ahora. La app es gratis y, con mi enlace, obtienes un 20% de descuento y una prueba gratuita de la suscripción premium.
¡No te pierdas esta oportunidad de transformar tu vida!

https://kit-maestro.web.app/app/?ref=`;
  tgText = `¿Qué esperas para formar parte de la revolución educativa del siglo? 🌟

Regístrate en KitMaestro ahora. La app es gratis y, con mi enlace, obtienes un 20% de descuento y una prueba gratuita de la suscripción premium.
¡No te pierdas esta oportunidad de transformar tu vida!`;
  refCode = '';

  refs = {
    thisMonth: 0,
    before: 0,
    paid: 0,
    pending: 0,
  }

  ngOnInit() {
    this.userSubscription$.subscribe(sub => {
      if (sub) {
        this.refCode = sub.refCode;
      }
    });
    this.referries$.subscribe((refs) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      this.refs.thisMonth = refs.filter(r => r.active && r.purchaseDate.getMonth() == currentMonth && r.purchaseDate.getFullYear() == currentYear).length;
      this.refs.before = refs.length - this.refs.thisMonth;
      this.refs.paid = refs.filter(r => r.active && !r.trial).length;
      this.refs.pending = refs.filter(r => r.active && r.paidRef).length;
    })
  }

  get waShareableLink() {
    return this.base + encodeURIComponent(this.text + this.refCode);
  }

  get tgShareableLink() {
    return this.tgBase + 'text=' + encodeURIComponent(this.text + this.refCode) + '&url=' + encodeURIComponent('https://kit-maestro.web.app/app/?ref=' + this.refCode);
  }

  findUser(uid: string): Observable<UserSettings> {
    return this.userSettingsService.getSettings(uid);
  }
}