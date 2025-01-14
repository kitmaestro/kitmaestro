import { Component, inject } from '@angular/core';
import { UserSettingsService } from '../../services/user-settings.service';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { UnitPlanService } from '../../services/unit-plan.service';
import { ClassPlansService } from '../../services/class-plans.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-users',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatIconModule,
		MatTableModule,
		RouterLink,
		DatePipe,
		ReactiveFormsModule,
		MatSelectModule,
		MatFormFieldModule,
		MatSnackBarModule,
		MatInputModule,
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss'
})
export class UsersComponent {
	private userService = inject(UserSettingsService);
	private subscriptionService = inject(UserSubscriptionService);
	private unitPlanService = inject(UnitPlanService);
	private classPlanService = inject(ClassPlansService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);

	columnsToDisplay = ['name', 'sex', 'email', 'phone', 'memberSince', 'actions']

	users$ = this.userService.findAll();
	subscriptions$ = this.subscriptionService.findAll();
	unitPlans$ = this.unitPlanService.findAll();
	classPlans$ = this.classPlanService.findAll();

	userForm = this.fb.group({
		firstname: [''],
		lastname: [''],
		gender: [''],
		email: ['', [Validators.email, Validators.required]],
		password: ['', [Validators.required]],
		phone: [''],
	});

	deleteUser(id: string) {
		this.userService.delete(id).subscribe({
			next: res => {
				if (res.deletedCount > 0) {
					this.users$ = this.userService.findAll();
				}
			}
		});
	}

	createUser() {
		this.userService.create(this.userForm.value as any).subscribe({
			next: res => {
				if (res._id) {
					this.users$ = this.userService.findAll();
				}
			},
			error: err => {
				this.sb.open('Usuario no guardado.', 'Ok', { duration: 2500 });
				console.log(err.message);
			}
		});
	}
}
