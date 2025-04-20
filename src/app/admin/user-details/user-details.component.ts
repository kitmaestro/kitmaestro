import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSettings } from '../../interfaces/user-settings';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SchoolService } from '../../services/school.service';
import { ClassSectionService } from '../../services/class-section.service';
import { UserSubscription } from '../../interfaces/user-subscription';
import { MatCardModule } from '@angular/material/card';
import { sha512_256 } from 'js-sha512';
import { DatePipe } from '@angular/common';
import { School } from '../../interfaces/school';
import { PretifyPipe } from '../../pipes/pretify.pipe';
import { ClassSection } from '../../interfaces/class-section';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-details',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    PretifyPipe,
    DatePipe,
  ],
  templateUrl: './user-details.component.html',
  styles: `.hero {
    padding: 48px;
    text-align: center;
}
mat-form-field {
  width: 100%;
}`
})
export class UserDetailsComponent implements OnInit {
  private router = inject(Router);
  private sb = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private userService = inject(UserSettingsService);
  private userId = this.route.snapshot.paramMap.get('id') || '';
  private subscriptionService = inject(UserSubscriptionService);
  private schoolService = inject(SchoolService);
  private sectionService = inject(ClassSectionService);
  private authService = inject(AuthService);

  user: UserSettings | null = null;
  subscription: UserSubscription | null = null;
  schools: School[] = [];
  classSections: ClassSection[] = [];
  gravatarUrl = '';
  activeUser: UserSettings | null = null;

  subscriptionForm = this.fb.group({
    user: [''],
    subscriptionType: ['Plan Básico'],
    status: ['active'],
    startDate: [(new Date()).toISOString().split('T')[0]],
    endDate: [(new Date(new Date().valueOf() + (30 * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]],
    method: ['cash'],
    amount: [0],
  })

  loadSubscription() {
    this.subscriptionService.findByUser(this.userId).subscribe({
      next: subscription => {
        this.subscription = subscription;
      }
    });
  }

  loadSchools() {
    this.schoolService.findAll({ user: this.userId }).subscribe({
      next: schools => {
        this.schools = schools;
      }
    })
  }

  loadSections() {
    this.sectionService.findAll({ user: this.userId }).subscribe({
      next: classSections => {
        this.classSections = classSections;
      }
    });
  }

  loadUser() {
    this.userService.find(this.userId).subscribe({
      next: user => {
        this.user = user;
        this.subscriptionForm.get('user')?.setValue(user._id);
        this.gravatarUrl =  'https://gravatar.com/avatar/' + sha512_256(user.email.toLowerCase().trim())
        this.loadSubscription();
        this.loadSchools();
        this.loadSections();
      },
      error: err => {
        this.router.navigateByUrl('/').then(() => {
          this.sb.open('Error al cargar el perfil del usuario', 'Ok', { duration: 2500 });
          console.log(err.message);
        });
      }
    });
  }

  ngOnInit() {
    this.loadUser();
    this.authService.profile().subscribe(user => {
      this.activeUser = user;
    });
  }

  onSubmit() {
    this.subscriptionService.create(this.subscriptionForm.value as any).subscribe(() => {
      this.loadUser();
    });
  }
}
