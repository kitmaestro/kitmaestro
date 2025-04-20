import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserSettings } from '../../interfaces/user-settings';
import { UpdateService } from '../../services/update.service';

@Component({
	selector: 'app-new',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		MatSnackBarModule,
		MatIconModule,
		ReactiveFormsModule,
		RouterModule,
	],
	templateUrl: './new.component.html',
	styleUrl: './new.component.scss',
})
export class NewComponent implements OnInit {
	private authService = inject(AuthService);
	private updateService = inject(UpdateService);
	private fb = inject(FormBuilder);
	private router = inject(Router);
	private sb = inject(MatSnackBar);
	private user: UserSettings | null = null;
	private route = inject(ActivatedRoute);
	private updateId = this.route.snapshot.paramMap.get('id') || '';

	postType = [
		{
			id: 'notice',
			label: 'Actualizacion',
		},
		{
			id: 'feature',
			label: 'Caracteristica Nueva',
		},
		{
			id: 'bug',
			label: 'Correccion de Error',
		},
	];

	form = this.fb.group({
		title: [''],
		date: [new Date().toISOString().split('T')[0]],
		type: ['notice'],
		description: [''],
		content: [''],
		author: [''],
		links: this.fb.array([]),
		actions: this.fb.array([]),
	});

	ngOnInit() {
		if (this.updateId) {
			this.updateService.find(this.updateId).subscribe({
				next: (update) => {
					if (update) {
						this.form.get('title')?.setValue(update.title);
						this.form
							.get('date')
							?.setValue(
								new Date(update.date)
									.toISOString()
									.split('T')[0],
							);
						this.form.get('type')?.setValue(update.type);
						this.form
							.get('description')
							?.setValue(update.description);
						this.form.get('content')?.setValue(update.content);
						this.form.get('author')?.setValue(update.author);
					}
				},
			});
		} else {
			this.authService.profile().subscribe((user) => {
				if (user) {
					this.form
						.get('author')
						?.setValue(`${user.firstname} ${user.lastname}`);
				}
			});
		}
	}

	onSubmit() {
		const data: any = this.form.value;
		if (this.updateId) {
			this.updateService.update(this.updateId, data).subscribe((res) => {
				if (res.modifiedCount > 0) {
					this.router.navigateByUrl('/updates').then(() => {
						this.sb.open(
							'Se ha publicado la actualizacion!',
							'Ok',
							{ duration: 2500 },
						);
					});
				}
			});
		} else {
			this.updateService.create(data).subscribe((res) => {
				if (res._id) {
					this.router.navigateByUrl('/updates').then(() => {
						this.sb.open(
							'Se ha publicado la actualizacion!',
							'Ok',
							{ duration: 2500 },
						);
					});
				}
			});
		}
	}

	addLink() {
		setTimeout(() => {
			this.links.push(
				this.fb.group({
					label: [''],
					link: [''],
					external: [true],
				}),
			);
		}, 0);
	}

	addAction() {
		setTimeout(() => {
			this.actions.push(
				this.fb.group({
					label: [''],
					link: [''],
				}),
			);
		}, 0);
	}

	removeLink(index: number) {
		this.links.removeAt(index);
	}

	removeAction(index: number) {
		this.actions.removeAt(index);
	}

	get links(): FormArray {
		return this.form.get('links') as FormArray;
	}

	get actions(): FormArray {
		return this.form.get('actions') as FormArray;
	}
}
