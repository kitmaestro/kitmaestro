import { Component, inject } from '@angular/core';
import { IsPremiumComponent } from '../../ui/alerts/is-premium/is-premium.component';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-math-worksheet-generator',
	imports: [
		IsPremiumComponent,
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSnackBarModule,
		ReactiveFormsModule,
	],
	templateUrl: './math-worksheet-generator.component.html',
	styleUrl: './math-worksheet-generator.component.scss',
})
export class MathWorksheetGeneratorComponent {
	userSubscriptionService = inject(UserSubscriptionService);
	fb = inject(FormBuilder);

	loading = false;

	topics = [
		{ id: 'addition', label: 'Suma' },
		{ id: 'subtraction', label: 'Suma' },
		{ id: 'multiplication', label: 'Suma' },
		{ id: 'division', label: 'Suma' },
	];

	generatorForm = this.fb.group({
		topic: ['addition'],
		type: ['exercise'],
		level: ['0'],
		items: [10],
	});
}
