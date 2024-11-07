import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { filter, map, Observable, zip } from 'rxjs';
import { NavigationComponent } from './navigation/navigation.component';
import { LoadingComponent } from './ui/loading/loading.component';
import { AuthService } from './services/auth.service';
import { UserSettings } from './interfaces/user-settings';
import { collectionData, collection, Firestore } from '@angular/fire/firestore';
import {  } from '@angular/fire/auth';
// import { UserSubscriptionService } from './services/user-subscription.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NavigationComponent,
    AsyncPipe,
    LoadingComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private authService = inject(AuthService);
  // private userSubscription = inject(UserSubscriptionService);
  private router = inject(Router);
  private user$ = this.authService.profile();
  private firestore = inject(Firestore);

  user: UserSettings | null = null;

  loading = true;

  redirectToLogin() {
    const next = location.pathname;
    this.loading = false;
    if (!next.includes('auth')) {
      this.router.navigate(['/auth', 'login'], { queryParams: { next } })
    }
  }

  loadUser() {
    this.user$.subscribe({
      next: (user) => {
        if (!user) {
          return this.redirectToLogin();
        }
        // this.userSubscription.subscribe('Premium', 'membership', (1000 * 60 * 60 * 24 * 365), 0, user._id).subscribe(console.log)
        this.user = user;
        this.loading = false;
      },
      error: err => {
        this.redirectToLogin();
        console.log(err.message)
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  reset() {
    this.loading = true;
    this.user = null;
    setTimeout(() => {
      this.loading = false;
    }, 1300);
  }

  ngOnInit() {
    this.loadUser();
    // this.aiService.generateImage('Can you design a binder separator background image in a letter size (8.5 by 11 inches) portrait position with a forest theme?').subscribe({
    //   next: res => {
    //     const img = document.createElement('img')
    //     img.src = res.result;
    //     document.body.appendChild(img)
    //     console.log('done!')
    //   },
    //   error: err => {
    //     console.log(err.message)
    //   }
    // });
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => this.loadUser());
    const users = [
      {
        email: "asilverio26@hotmail.com",
        uid: "gDJQW2u1OpVWFwznlx5iuFEGHMt1"
      },
      {
        email: "yessicaalcantaragalay@gmai.com",
        uid: "U3XDe7HHf4gvE5ZbEwjnYBnunqv2"
      },
      {
        email: "edlaureano2395@gmail.com",
        uid: "16TA6ZMOyERlxriLcLIBXyofz4i2"
      },
      {
        email: "rmrosarioperalta@gmail.com",
        uid: "8SSDHiAZeOgdKdXK9FU7YarPaJr1"
      },
      {
        email: "mrosalba.toribio@gmail.com",
        uid: "jWoTW5P15mYqKB7W57iZTJd2RVT2"
      },
      {
        email: "clarianaledesma@gmail.com",
        uid: "kLB3QBtMiXaUwsqdZInGKQUUgcb2"
      },
      {
        email: "margaritamatos221@gmail.com",
        uid: "Dabzy4EYBrQC5CEDZc2NoHStlUX2"
      },
      {
        email: "mercedesanajulia@gmail.com",
        uid: "Z1CVfjla6lRNinjirlf5zDbl15z1"
      },
      {
        email: "maireni9727@gmail.com",
        uid: "tBXGNq7feVfTAb9Bkvdh3kPNnGn1"
      },
      {
        email: "alexandramespsto@gmail.com",
        uid: "nMWWrKaKO9VXN5WR09J56bFFv5S2"
      },
      {
        email: "frayelinaquino8@gmail.com",
        uid: "uWyCCvtn6SWTz2HuNqSFggNPR8J2"
      },
      {
        email: "kfefilms@gmail.com",
        uid: "3BhUlAPuK4WJBorjPv6OSqkO25I2"
      },
      {
        email: "yumilkarr26@gmail.com",
        uid: "bNXxm9CWZOdA04fTqXLL4zFw8v22"
      },
      {
        email: "chavez047rd@gmail.com",
        uid: "VhGwz4B1XZSJaL5WAoT7WeVvVA22"
      },
      {
        email: "julissamercedes03@gmail.com",
        uid: "zX1Gu6Omx3gLpFqGEImB80CRsBE3"
      },
      {
        email: "paulinaandujar1991@gmail.com",
        uid: "xWHyjfVvwxWhYsKXV24JyKbymNi2"
      },
      {
        email: "erijo039@gmai.com",
        uid: "o2Bobryx84eWj8vGhOejLoaRwjn2"
      },
      {
        email: "fcontinua01@gmail.com",
        uid: "PX3vOYwdd5eFjOLnZZsSoiAeHmA3"
      },
      {
        email: "angelarivasfilpo@gmail.com",
        uid: "jECoqqmT4zLdOPxoYMaft5bmrXk1"
      },
      {
        email: "yeovalle22@gmail.com",
        uid: "43MiJQqwZROET2tup1kdoSA7nZw1"
      },
      {
        email: "liyilaprofe@gmail.com",
        uid: "Pm85pLKKJghoyhp8bpC7FWBlvPr2"
      },
      {
        email: "lissettecastillo72@gmail.com",
        uid: "Q36JM9YfbDSaztZIbiSTcUb2ZfH2"
      },
      {
        email: "igaa2704@gmail.com",
        uid: "M5STDVP6CDgAkzImp4qZn4HIXmp1"
      },
      {
        email: "minderwild123@gmail.com",
        uid: "jLN8VLikNvQEaKKYUVy6HrNZUSt2"
      },
      {
        email: "rsandovalpinales694@gmail.com",
        uid: "XuCutNBIsFQb7mCtf5Wtebaz92B3"
      },
      {
        email: "juanni0318@gmail.com",
        uid: "kUgFoeziUeXrwKbS2aUnh2GsnbI3"
      },
      {
        email: "deyanira.ortega26@gmail.com",
        uid: "qrfB0JwB2JhX5sdNeiMNHDzJli42"
      },
      {
        email: "suarezanyely7@gmail.com",
        uid: "YCOT2n6b8AaLebGjfk1do9bAMMy1"
      },
      {
        email: "skysuperstore26@gmail.com",
        uid: "n52A1SrlwARTQzgFp7mG6zXiI1J2"
      },
      {
        email: "geronnyg@gmail.com",
        uid: "4BhdWhHoPzWngCBCeK9g5AAnmUH2"
      },
      {
        email: "yairyzamatosrichiez@gmail.com",
        uid: "qfp80ECaovak64PjOsZwKrsYQQt1"
      },
      {
        email: "dangelisramirez09@gmail.com",
        uid: "nNYznGcNDcPW9IIfERPvQTFkFE62"
      },
      {
        email: "alexmercedesv@gmail.com",
        uid: "Hdh8zbiGPKQ1FH4t5xXsXuiF7WB3"
      },
      {
        email: "jeancarlobenitez79@gmail.com",
        uid: "lCOeV5QrgfTqdfqXTcqZ3ZWCQ3r2"
      },
      {
        email: "auryssarit@gmail.com",
        uid: "TlKl8LutVSe05ZUZdEqSQGZFYGJ2"
      },
      {
        email: "crismairyporfirio14@gmail.com",
        uid: "U2MD8zejuJNwE06glZgW9yBM52z2"
      },
      {
        email: "ismabelgonzalez458@gmail.com",
        uid: "sbFOXIOZFjcWKFAOEFYqkUu0JRV2"
      },
      {
        email: "ismabelbatista.geronimo05@gmail.com",
        uid: "sOAYaLgmTsg2DT1P5TkHox6KkY22"
      },
      {
        email: "lic.albayris@gmail.com",
        uid: "viILBEUP5TSRhjJM08UumODG4o53"
      },
      {
        email: "yuliannyrosario0920@gmail.com",
        uid: "YTOgBe8OJYWEg1vMtzWRs5MC8H03"
      },
      {
        email: "yudelkarodrigur@gmail.com",
        uid: "yCMPWcvIjPObFdVgbr3fIelxE563"
      },
      {
        email: "anilissette.13@gmail.com",
        uid: "o4MiIO72Ilf6KL66WVMayyovDcH2"
      },
      {
        email: "jhoannaperalta06@gmail.com",
        uid: "KyyBmD4Fo3SLJ00hwdfdoeYcCSK2"
      },
      {
        email: "anibelkysespinal@gmail.com",
        uid: "OX2igUbh74MHCqzjQgWRcuIq1t83"
      },
      {
        email: "ammimercedes@gmail.com",
        uid: "66lGkaWjgLW0FDYLmXp1wzYRz513"
      },
      {
        email: "lic.vilorio_07@hotmail.com",
        uid: "zMWodHn8zvNIpNminBECqqIEz4u1"
      },
      {
        email: "nilsam974@gmail.com",
        uid: "S2vnRY6XoEZiYjIfBktGl5RD7Nd2"
      },
      {
        email: "crislaudydelacruz@gmail.com",
        uid: "ApVWSp8LKAN4p6SHwK8nj8xUdr03"
      },
      {
        email: "topacio0458@gmail.com",
        uid: "asH2NkT0pgOVRJGDtp5GXom7Wtb2"
      },
      {
        email: "josefinaamparo.c@gmail.com",
        uid: "Tf8Qc06txyPsvcpP3AthfDSc5Ew1"
      },
      {
        email: "frias07011999@gmail.com",
        uid: "T8cmuhz1vAg0Nywpfq0Ff6hRqq52"
      },
      {
        email: "catelar2015@gamil.com",
        uid: "J2Jf87eSb8hkBL7sAAgtTYHyXTE2"
      },
      {
        email: "aureliomf2989@gmail.com",
        uid: "bQTgRuLt0ISaaAhvSdcsy1P2jvA2"
      },
      {
        email: "joeldejesus1980.jb@gmail.com",
        uid: "J7xHDVIElzYP0q1vJBb8Qxf28Ky2"
      },
      {
        email: "depazmanuela1456@gmail.com",
        uid: "EFIhOndZrCMp1d38dFyMOOaiZwx1"
      },
      {
        email: "pegueromercedes1@icloud.com",
        uid: "a0ACRpHtgLbYjErOmtXiIKxe5R73"
      },
      {
        email: "nataliaduartevargasnatalia@gmail.com",
        uid: "gOwh8xdf7XVdFG2ItLQuTNxWEYQ2"
      },
      {
        email: "evelio0485@gmail.com",
        uid: "bhlbWOlOpYSJIRnWFrjWuhROpPI3"
      },
      {
        email: "dawilkaortegaperez@gmail.com",
        uid: "Yc3a0fVGgPX4HdC4KHbFS99ky6B3"
      },
      {
        email: "glennyfrancisco79@gmail.com",
        uid: "QeTMBhYNGuWJpadPbKwi3auHA3q2"
      },
      {
        email: "thelicdaems17@gmail.com",
        uid: "uhDU3yAmQzQagy0z7HE1gqjilAN2"
      },
      {
        email: "wanderv58@gmail.com",
        uid: "gQYLQ8L506SFGOWvsdFDSf7VOAS2"
      },
      {
        email: "joelmancebo57@gmail.com",
        uid: "4mOYOP7qt3gJrUzsCq6QZtYAIu23"
      },
      {
        email: "anaosoria123456789@gmail.com",
        uid: "ZOlKxgig2CM0EHpTKFOMcdgwmxf1"
      },
      {
        email: "maudelin0206@gmail.com",
        uid: "79aFPC5zfHdt73W2K3hU0e8r1v63"
      },
      {
        email: "jimenezreyesindianas@gmail.com",
        uid: "qbY1EdJdm0NDgLMF05nPFMF67fs2"
      },
      {
        email: "pedrodrullard500@gmail.com",
        uid: "w26kVHwusvWyYWBPT0zEMSMQSd53"
      },
      {
        email: "yudelkacarela13@gmail.com",
        uid: "CUTObgsAARfyrJsmRXfoLNUJGwd2"
      },
      {
        email: "shainabanks1984@gmail.com",
        uid: "MGYBsHxQyTZl3LA014n4Y8WvcyA2"
      },
      {
        email: "lucydiaz5445@gmail.com",
        uid: "1AlWwai4qZRG6f9Y5ClDazWMvkH3"
      },
      {
        email: "solanyi2598@gmail.com",
        uid: "o5uyfKYVgATPEHULRc1UhiWUZGy2"
      },
      {
        email: "evangelinatrinidad4@gmail.com",
        uid: "dDN5FZlWXjflxBER8VG4OpO0rBb2"
      },
      {
        email: "belkisaraujo15@gmail.com",
        uid: "9r3w61P6ydeNLlSJh5c2m9SufYM2"
      },
      {
        email: "andigar25@gmail.com",
        uid: "SDHzQsH4uKYuW4K05lEYNS5ITvh2"
      },
      {
        email: "yahairacordero5627@gmail.com",
        uid: "PkD14rEBU0eU28z53dHng5ML8s72"
      },
      {
        email: "mejiaesthercarolina61@gmail.com",
        uid: "yAkKs4QppcSREqMBfzlO5wD2zEq1"
      },
      {
        email: "michael.burgos.m@gmail.com",
        uid: "N4mQfitEItb8Ty9qDpNNTx4ccof1"
      },
      {
        email: "natanieldiaz77@gmail.com",
        uid: "tEJBTKbm4COnoxCPL1yzpzx56iT2"
      },
      {
        email: "antoniorodriguez100990@gmail.com",
        uid: "NaMJjkO7vJMgCwDsLS3Y6KCkApE2"
      },
      {
        email: "kelvinm1022@gmail.com",
        uid: "TKV7QJTSHZM0tM4k3XDn98qSa5x2"
      },
      {
        email: "franklinhm443@gmail.com",
        uid: "cjxnLB4riWVa5Njnbet4Nlz9fa83"
      },
      {
        email: "luzmgratini@gmail.com",
        uid: "dclYUo0pZMXjzV7GqwNuiS3zpHg1"
      },
      {
        email: "delarosanewton@gmail.com",
        uid: "hWbOcFQy0sdCRamLvuzEA4DiDmX2"
      },
      {
        email: "cnljosemartinez@gmail.com",
        uid: "9Q25uSjexYP4Npu5uxAFpIzyiqD2"
      },
      {
        email: "barreramenaa@gmail.com",
        uid: "3v7mvEOKSnawsOpz0q7Wv1FFqiN2"
      },
      {
        email: "joseadames1266@gmail.com",
        uid: "9ZyVECKDhdMNze22BJ8Qm6vMIPl1"
      },
      {
        email: "licccontrerasperez29@gmail.com",
        uid: "Kn121EqQGtTBC3Tf0a4QSuWBCep1"
      },
      {
        email: "smailynthesrc@gmail.com",
        uid: "rc6ii9x1NqOKHYXnFfynAIa1Dh62"
      },
      {
        email: "yeimyd287@gmail.com",
        uid: "NUYebYY9QzVY9Fp1a5VVP41Wkmz1"
      },
      {
        email: "waner3000@gmail.com",
        uid: "viOl5ElSprNXv5kC2nccqXzUtmB2"
      },
      {
        email: "mildrechanelmercedescastillo@gmail.com",
        uid: "47pQluAkBlgG0NqNZAswvzZKORw2"
      },
      {
        email: "yocasty07a@gmail.com",
        uid: "DWubsqPT9eVBayI7OasZZEioqNG2"
      },
      {
        email: "marielystroncoso8@gmail.com",
        uid: "LZBLKgbu5hh2zRmNuU0lLoLKeeU2"
      },
      {
        email: "alcantara0706@hotmail.com",
        uid: "LWFCiIljnRPenJYJQwl1EFaIBsA2"
      },
      {
        email: "estebanianunezbonilla@gmail.com",
        uid: "tJYhVPz6hVWjnwX98PT8K73hSrU2"
      },
      {
        email: "leidydelarosa58@gmail.com",
        uid: "wePQUSdLtxO3zVnD7oKYoSXIfv02"
      },
      {
        email: "yessicaalcantaragalay@gmail.com",
        uid: "AwtSKOwyKrgc5DNDpOUwaxwfA2J3"
      },
      {
        email: "marielaliriano3101@gmail.com",
        uid: "u1onaBfq3pgVUB8UP1NETCBa6Bt1"
      },
      {
        email: "gisselpantaleon23@gmail.com",
        uid: "2H47RANzjOPOlZnJrbOWUAtn1P93"
      },
      {
        email: "aanamarselly@gmail.com",
        uid: "ogSxXuRAxQRjObIZNML2rcOS4pJ3"
      },
      {
        email: "rodriguezgreenanyeli@gmail.com",
        uid: "dzuWDfXbSROwt8Xgb56EWTO3xaw1"
      },
      {
        email: "anninieves18@gmail.com",
        uid: "6ApulRjprSd3TKPrVIwuyXtDTQ73"
      },
      {
        email: "daniloa3512@gmail.com",
        uid: "6pxQWispr2dEeAkOJkd96KPR8eu1"
      },
      {
        email: "alcantaracristal335@gmail.com",
        uid: "xTYHYr6m51hiATffxBiGPOlGAoB2"
      },
      {
        email: "felicitaherrera592@gmail.com",
        uid: "IpY94P7utydIA9mQNMolPY3RgoM2"
      },
      {
        email: "niscaury.martinez@gmail.com",
        uid: "PiEJYSj48CbZXlcSk0YjIls0eMj1"
      },
      {
        email: "robertnatanaelsilverio@gmail.com",
        uid: "Q2oGiglTvbhkXyehtfr3pJ9Ltbm1"
      },
      {
        email: "ewdomarramirez@gmail.com",
        uid: "XryIhIckIbePEOImOmQn5MHlrlK2"
      },
      {
        email: "drullardmatrillel@gmail.com",
        uid: "DRccVQtaqndI6DA1XrCqCzCb86H2"
      },
      {
        email: "merlinduarte892@gmail.com",
        uid: "Szd0aaPnrJXAydqeTDNavM2z8Ky1"
      },
      {
        email: "piolin912@gmail.com",
        uid: "zzcCyJJbuVSfIqmd2lTc3IYDf6y2"
      },
      {
        email: "andrinelsi_ab98@hotmail.com",
        uid: "uJgepUzeoRehgj74diak3cZg1S62"
      },
      {
        email: "garciaadonis0002@gmail.com",
        uid: "hPSldDsE6zRp2eTZ35oF7Mj4qHx1"
      },
      {
        email: "valeriaotanosanchez82@gmail.com",
        uid: "wJQipgT72pgAP2jP21SUHeSnGus2"
      },
      {
        email: "mmpuello@gmail.com",
        uid: "9umyME0tSEMVzBwcnIehbtQ7Sqr2"
      },
      {
        email: "deliadelarosa00@gmail.com",
        uid: "LBPomiLWlkRULcILH7cwu2d4LI92"
      },
      {
        email: "alvarodiaz5671esq1@gmail.com",
        uid: "UCZyPFPQG7NDA1VTiyeNc1XUFuw2"
      },
      {
        email: "yudelinburgos3@gmail.com",
        uid: "cXm5062NbNNAbTzF4ioF8iHwAj42"
      },
      {
        email: "marileidyibe@gmail.com",
        uid: "kTyjFAotbwOwtdKFGQFiFD4skKZ2"
      },
      {
        email: "parraadalgisa392@gmail.com",
        uid: "ZWEXlUx8QWezZMQpyAUlXV82Rua2"
      },
      {
        email: "randaldelossantosdecena@gmail.com",
        uid: "wQF4IIVdocdSmKkKKgUMTmHOzkh1"
      },
      {
        email: "mariela2250@gmail.com",
        uid: "2j73SpR6a0YYmmjzDiiBijIBvig2"
      },
      {
        email: "cridson44@gmail.com",
        uid: "oIThmTmgi8g3hN7I3BNn1LucG5D2"
      },
      {
        email: "layole90@gmail.com",
        uid: "xuiLDBgy5xWAGizWd356Byq9IIw1"
      },
      {
        email: "juanadelarosa0005@gmail.com",
        uid: "1kiiUOiDDHaWqVp8WyhRAk4wIcg2"
      },
      {
        email: "moralesbatistaemma@gmail.com",
        uid: "KUtB6gvXGiMFMNPaCWinHnOiIHp1"
      },
      {
        email: "elisangel1999@gmail.com",
        uid: "K68r6hQlnCXYn7Fpv9LDHc5CPQw2"
      },
      {
        email: "leonardodiaztrinidad09@gmail.com",
        uid: "0d6MomPWBYess8qBreHO0Yamd8l1"
      },
      {
        email: "lisbenifamilia@gmail.com",
        uid: "Of1BaUIcUaSlq82JyjmdUfnI1a72"
      },
      {
        email: "mercedesdoloresp04@gmail.com",
        uid: "3IdLuR6nuXa8meMAMezpMetSx132"
      },
      {
        email: "lisbenirodriguez3@gmail.com",
        uid: "NBag8uRfTYa0qgOnLkCiKEDeNGb2"
      },
      {
        email: "epifaniapimentel12@gmail.com",
        uid: "ff8cVGVPfAS2Nltiz8pr9oO82yG2"
      },
      {
        email: "elisaulabueno93@gmail.com",
        uid: "brkss0OXcncWmgUo7cIK2pl3Ul02"
      },
      {
        email: "darlereyes08@gmail.com",
        uid: "cuaWendXwWPg829I83VqnuoDZXy1"
      },
      {
        email: "alcantararosarioannycarolina@gmail.com",
        uid: "efAYP2OLfGhnsZnHEyblxdHcIBZ2"
      },
      {
        email: "yinettagueda@gmail.com",
        uid: "xSdXVEYbMHQ9SnaBVdXGVYiAPKq1"
      },
      {
        email: "ecorreat05@gmail.com",
        uid: "NrB1BusKG5USdewrEYlyVK0mxlq1"
      },
      {
        email: "zapatajohanny54@gmail.com",
        uid: "7rYqiCPJmyQJtB3wkA2SOekT9pv2"
      },
      {
        email: "olbis.pena.5@gmail.com",
        uid: "5jFlXQbGrCRXdU0XF50GlrXYHz73"
      },
      {
        email: "epifaniastephensr@gmail.com",
        uid: "n6viUo5ru6X1RiC9iEl4zesoJnI3"
      },
      {
        email: "crismelrf07@gmail.com",
        uid: "3YQsQfRidyTo3o0z4a7QzXK0rgy2"
      },
      {
        email: "yissellcruz06@gmail.com",
        uid: "UMVO2jF62xb9ZGuvRYzFFZjAGi02"
      },
      {
        email: "kendyhorton0226@gmail.com",
        uid: "bKLMJospjcSrf7yOgPL2xC99lHj1"
      },
      {
        email: "glennyalcantara09@gmail.com",
        uid: "QOXhqdnZOnUSPC6be9PKjLwfkvt2"
      },
      {
        email: "sreyessoriano6@gmail.com",
        uid: "SWVwzJJAEWfIEP2cZePrAfx9Kwr2"
      },
      {
        email: "jimenezevelyn808@gmail.com",
        uid: "UqOjZlztfLUeoDAAuOhwTXQNrRw2"
      },
      {
        email: "rubenecastro06@gmail.com",
        uid: "XynhssZSGCfSwpjiEqPfpz8jqUs2"
      },
      {
        email: "guidonieto123@outlook.es",
        uid: "DU6dXkxmtmTLf7ymiTW58uJBwvv1"
      },
      {
        email: "yefry31441@gmail.com",
        uid: "Zbz5bqkpOsX0Ib1zJPgpsgTDrhC3"
      },
      {
        email: "peraltadelarosayovani@gmail.com",
        uid: "cw2yRXCeVfREuMMpQ6ieaEpEGkw2"
      },
      {
        email: "mariflores1324950203@gmail.com",
        uid: "AftzXPS88tQx7na37GhbVmIgDGk2"
      },
      {
        email: "cornelioespinal17@gmail.com",
        uid: "0Zov1Ma24iWGBK4kRYYIsmhiLRp2"
      },
      {
        email: "manzuetar788@gmail.com",
        uid: "HouRgMlJ0uV3YgUbKxVBSL9Zyt52"
      },
      {
        email: "marielis20payano@gmail.com",
        uid: "imEnrUAEAtgfVcP5uq2fSOEY9n13"
      },
      {
        email: "theluisgarcia13@gmail.com",
        uid: "pWKf994kxwZgVDRLIBi4zbSsLY23"
      },
      {
        email: "yuleiseguerrerogarcia@gmail.com",
        uid: "x2JpORaFUWbwX7SfBee72lolmbi1"
      },
      {
        email: "yesenia2011mauricio@gmail.com",
        uid: "3AV8Yme211NEw3dUBxHorv0J0Sq1"
      },
      {
        email: "freiddyperalta@gmail.com",
        uid: "8rrn0c5PUvZukSUSZ04azxcPt8y1"
      },
      {
        email: "ferrodriguez065@gmail.com",
        uid: "azl9kf3iv1TGNrgiPoXEgFXQZoD2"
      },
      {
        email: "alexandermercedes1980@gmail.com",
        uid: "Xry6VaCC0pSHaY0zQVAH74iAeHm1"
      },
      {
        email: "alberto0401@gmail.com",
        uid: "DC1mAKTF3qWbwqJx5jem0gxURdc2"
      },
      {
        email: "danilo0476@gmail.com",
        uid: "sQn7JD2IEUfA1VLDc8nV3yfFgRE2"
      },
      {
        email: "miguelramoscastro80@gmail.com",
        uid: "tYmDWcEDNdVTwcYKjNF4BP2h7nM2"
      },
      {
        email: "pluisalberto50@gmail.com",
        uid: "8nP6BdjGaveVLRZpZr886EwGOmC3"
      },
      {
        email: "vianelisramos01@gmail.com",
        uid: "OZFdoF16o4avqRRzEs9p2xn2ncv1"
      },
      {
        email: "orgalay.dev@gmail.com",
        uid: "qlcWyD8LjUXdR48kNmyx0NC8fN03"
      },
    ];
    const subscriptions = collectionData(collection(this.firestore, 'user-subscriptions'), { idField: 'id' }) as Observable<any[]>;
    const settings = collectionData(collection(this.firestore, 'user-settings'), { idField: 'id' }) as Observable<any[]>;

    // zip(subscriptions, settings).pipe(
    //   map(([subscriptions, settings]) => {
    //     return subscriptions.map(s => {
    //       const referrer = subscriptions.find(sub => sub.refCode == s.referral);
    //       const ref: any = users.find(u => u.uid == referrer?.uid);
    //       const user: any = users.find(u => u.uid == s.uid);
    //       user.profile = settings.find(u => u.uid == s.uid);
    //       s.user = user;
    //       const referral = {
    //         referred: user.email,
    //         referrer: ref?.email,
    //         date: new Date(),
    //         status: s.active ? 'paid' : 'pending'
    //       }
    //       return referral;
    //     })
    //   })
    // ).subscribe(res => console.log(res))
  }
}
