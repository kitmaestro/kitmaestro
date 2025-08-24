import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { UserSettings } from '../../core/interfaces/user-settings';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SchoolService } from '../../core/services/school.service';
import { School } from '../../core/interfaces/school';
import { RouterLink } from '@angular/router';
import { UserSubscription } from '../../core/interfaces/user-subscription';
import { UserSubscriptionService } from '../../core/services/user-subscription.service';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-user-profile',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatSnackBarModule,
		RouterLink,
		MatIconModule,
		DatePipe,
		ReactiveFormsModule,
	],
	templateUrl: './user-profile.component.html',
	styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
	private authService = inject(AuthService);
	private schoolService = inject(SchoolService);
	private userSubscriptionService = inject(UserSubscriptionService);
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);
	public user: UserSettings | null = null;

	public alreadyCode = false;
	userSubscription = signal<UserSubscription | null>(null);

	userForm = this.fb.group({
		title: [''],
		firstname: [''],
		lastname: [''],
		username: [''],
		email: [''],
		gender: ['Hombre'],
		phone: [''],
		refCode: [''],
	});

	schoolsForm = this.fb.array([
		this.fb.group({
			_id: [''],
			user: [''],
			name: [''],
			level: [''],
			regional: [''],
			district: [''],
			journey: [''],
		}),
	]);

	titleOptions: {
		Hombre: { value: string; label: string }[];
		Mujer: { value: string; label: string }[];
	} = {
			Hombre: [
				{ value: 'Licdo', label: 'Licenciado' },
				{ value: 'Mtro', label: 'Maestro' },
				{ value: 'Dr', label: 'Doctor' },
			],
			Mujer: [
				{ value: 'Licda', label: 'Licenciada' },
				{ value: 'Mtra', label: 'Maestra' },
				{ value: 'Dra', label: 'Doctora' },
			],
		};

	ngOnInit() {
		this.schoolService.findAll().subscribe((schools) => {
			if (schools.length) {
				this.removeSchool(0);
				schools.forEach((school) => {
					this.addSchool(school);
				});
			}
		});
		this.userSubscriptionService.checkSubscription().subscribe((sub) => this.userSubscription.set(sub));
		this.authService.profile().subscribe({
			next: (user) => {
				this.user = user;
				this.schoolsForm.controls[0].get('user')?.setValue(user._id);
				const {
					title,
					firstname,
					lastname,
					username,
					email,
					gender,
					phone,
					refCode,
				} = user;
				this.userForm.get('gender')?.setValue(gender || 'Hombre');
				this.userForm.setValue({
					title: title || '',
					firstname: firstname || '',
					lastname: lastname || '',
					username: username || '',
					email: email || '',
					gender: gender || '',
					phone: phone || '',
					refCode: refCode || '',
				});
				if (user.refCode) {
					this.userForm.get('refCode')?.disable();
				}
			},
		});
	}

	onSubmit() {
		const profile: any = this.userForm.value;
		this.authService.update(profile).subscribe({
			next: (res) => {
				if (res.modifiedCount === 1) {
					this.sb.open('Perfil actualizado con exito', 'Ok', {
						duration: 2500,
					});
				}
			},
			error: (err) => {
				console.log(err);
				this.sb.open('Hubo un error al guardar', 'Ok', {
					duration: 2500,
				});
			},
		});
	}

	addSchool(school?: School) {
		const _id = school?._id || '';
		const user = school?.user || this.user?._id || '';
		const name = school?.name || '';
		const level = school?.level || '';
		const regional = school?.regional || '';
		const district = school?.district || '';
		const journey = school?.journey || '';
		const schoolForm = this.fb.group({
			_id: [_id],
			user: [user],
			name: [name],
			level: [level],
			regional: [regional],
			district: [district],
			journey: [journey],
		});
		this.schoolsForm.push(schoolForm);
	}

	removeSchool(index: number) {
		const id = this.schoolsForm.value[index]._id;
		if (id) {
			this.schoolService.delete(id).subscribe();
		}
		this.schoolsForm.removeAt(index);
	}

	saveSchool(index: number) {
		const school: any = this.schoolsForm.controls[index].value;
		school._id = undefined;
		this.schoolService.create(school).subscribe((res) => {
			if (res._id) {
				this.schoolsForm.controls[index].get('_id')?.setValue(res._id);
				this.sb.open('La escuela ha sido guardada', 'Ok', {
					duration: 2500,
				});
			}
		});
	}

	get titles() {
		const gender = this.userForm.get('gender')?.value;
		if (gender === 'Hombre') {
			return this.titleOptions.Hombre;
		}
		return this.titleOptions.Mujer;
	}
}
