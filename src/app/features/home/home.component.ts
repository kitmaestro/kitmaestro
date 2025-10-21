import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { UserSubscription } from '../../core';
import { UserSubscriptionService } from '../../core/services/user-subscription.service';
import { forkJoin } from 'rxjs';
import { ClassSectionService } from '../../core/services/class-section.service';
import { ClassSection } from '../../core';
import { activitiesTools, assessmentTools, planningTools, registryTools, resourcesTools, supportTools } from '../../config';
import { ToolGalleryComponent } from './tool-gallery.component';

@Component({
	selector: 'app-home',
	imports: [
		CommonModule,
		RouterModule,
		MatIconModule,
		MatCardModule,
		MatGridListModule,
		MatSlideToggleModule,
		MatTooltipModule,
		MatFormFieldModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		ReactiveFormsModule,
		MatChipsModule,
		MatTabsModule,
		ToolGalleryComponent,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
	private UserService = inject(UserService);
	private userSubscriptionService = inject(UserSubscriptionService);
	private classSectionsService = inject(ClassSectionService);
	user: User | null = null;
	subscription = signal<UserSubscription | null>(null);

	sections = signal<ClassSection[]>([]);

	planningTools = planningTools;
	resourcesTools = resourcesTools;
	assessmentTools = assessmentTools;
	registryTools = registryTools;
	activitiesTools = activitiesTools;
	supportTools = supportTools;

	ngOnInit() {
		forkJoin([
			this.classSectionsService.findSections(),
			this.UserService.getSettings(),
			this.userSubscriptionService.checkSubscription()
		])
			.subscribe({
				next: ([sections, user, sub]) => {
					this.sections.set(sections);
					this.subscription.set(sub);
					this.user = user;
				},
				error: error => {
					console.log(error);
				}
			});
	}
}
