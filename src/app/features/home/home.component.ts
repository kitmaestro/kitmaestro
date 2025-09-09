import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppEntry } from '../../core/interfaces/app-entry';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { AppTileComponent } from '../../shared/ui/app-tile.component';
import { UserSettingsService } from '../../core/services/user-settings.service';
import { UserSettings } from '../../core/interfaces/user-settings';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { UserSubscription } from '../../core/interfaces/user-subscription';
import { UserSubscriptionService } from '../../core/services/user-subscription.service';
import { WhatsAppShareService } from '../../core/services/whatsapp.service';
import { tap } from 'rxjs';
import { ClassSectionService } from '../../core/services/class-section.service';
import { ClassSection } from '../../core/interfaces/class-section';
import { activitiesTools, assessmentTools, planningTools, registryTools, resourcesTools, supportTools } from '../../config/constants';

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
		AppTileComponent,
		ReactiveFormsModule,
		MatChipsModule,
		MatTabsModule,
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
	private userSettingsService = inject(UserSettingsService);
	private userSubscriptionService = inject(UserSubscriptionService);
	private classSectionsService = inject(ClassSectionService);
	private waService = inject(WhatsAppShareService);
	user: UserSettings | null = null;
	subscription = signal<UserSubscription | null>(null);
	categories: string[] = [];

	sections = signal<ClassSection[]>([]);

	apps: { category: string; tools: AppEntry[] }[] = [
		{ category: 'Planificación', tools: planningTools },
		{ category: 'Recursos', tools: resourcesTools },
		{ category: 'Evaluación', tools: assessmentTools },
		{ category: 'Registro', tools: registryTools },
		{ category: 'Actividades', tools: activitiesTools },
		{ category: 'Apoyo y Soporte', tools: supportTools },
	];

	planningTools = planningTools;
	resourcesTools = resourcesTools;
	assessmentTools = assessmentTools;
	registryTools = registryTools;
	activitiesTools = activitiesTools;
	supportTools = supportTools;

	waMessage = '';

	ngOnInit() {
		this.classSectionsService
			.findSections()
			.subscribe((sections) => this.sections.set(sections));
		this.userSettingsService
			.getSettings()
			.pipe(
				tap(
					(user) =>
						(this.waMessage = `Ultimamente he estado utilizando una app para hacer mis planificaciones en solo 5 minutos.
Aqui esta el link para que la pruebes:
https://app.kitmaestro.com/auth/signup?ref=${user.username || user.refCode || user.email.split('@')[0]}`),
				),
			)
			.subscribe((user) => (this.user = user));
		this.userSubscriptionService
			.checkSubscription()
			.subscribe((sub) => this.subscription.set(sub));
	}

	visibleToUser(tier: number = 1) {
		const sub = this.subscription();
		if (!sub) return false;
		const accessLevel: number =
			sub.subscriptionType == 'FREE' || sub.status !== 'active' || new Date(sub.endDate) < new Date()
				? 1
				: sub.subscriptionType == 'Plan Básico'
					? 2
					: sub.subscriptionType == 'Plan Plus'
						? 3
						: 4;
		return tier <= accessLevel;
	}

	share() {
		this.waService.open(this.waMessage);
	}
}
