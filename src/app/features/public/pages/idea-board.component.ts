import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Idea } from '../../../core/interfaces/idea';
import { IdeaService } from '../../../core/services/idea.service';
import { UserSettings } from '../../../core/interfaces/user-settings';
import { UserSettingsService } from '../../../core/services/user-settings.service';

@Component({
	selector: 'app-idea-board',
	imports: [
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
	],
	template: `
		<h2>Pizarron de Ideas</h2>
		<p>
			En este espacio, nuestros usuarios pueden presentar sus ideas y
			votar por las mejores. Cada semana se eligirá la idea mas votada
			para implementar en la plataforma.
		</p>

		<div>
			<h3>Agregar Idea</h3>
			<form [formGroup]="ideaForm" (ngSubmit)="addIdea()">
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Título</mat-label>
						<input type="text" formControlName="title" matInput />
					</mat-form-field>
				</div>
				<div>
					<mat-form-field appearance="outline">
						<mat-label>Descripción</mat-label>
						<textarea
							formControlName="description"
							matInput
						></textarea>
					</mat-form-field>
				</div>
				<div>
					<button type="submit" mat-flat-button color="primary">
						Agregar
					</button>
				</div>
			</form>
		</div>

		<div class="grid">
			@for (idea of ideas; track idea._id) {
				<mat-card>
					<mat-card-header>
						<h3 mat-card-title>{{ idea.title }}</h3>
					</mat-card-header>
					<mat-card-content>
						<p>{{ idea.description }}</p>
						<p>
							Por {{ idea.user.firstname }}
							{{ idea.user.lastname }}
						</p>
					</mat-card-content>
					<mat-card-actions>
						<button
							mat-fab
							extended
							type="button"
							(click)="dislike(idea)"
							[style]="
								'margin-right: 12px;' +
								(iDislikedIt(idea)
									? 'background-color: #005cbb;'
									: '')
							"
						>
							<mat-icon>thumb_down</mat-icon> {{ dislikes(idea) }}
						</button>
						<button
							mat-fab
							extended
							type="button"
							(click)="like(idea)"
							[style]="
								iLikedIt(idea)
									? 'background-color: #005cbb;'
									: ''
							"
						>
							<mat-icon>thumb_up</mat-icon> {{ likes(idea) }}
						</button>
					</mat-card-actions>
				</mat-card>
			}
		</div>
	`,
	styles: `
		.grid {
			margin-top: 24px;
			display: grid;
			grid-template-columns: 1fr;
			gap: 24px;

			@media screen and (min-width: 720px) {
				grid-template-columns: 1fr 1fr;
			}

			@media screen and (min-width: 960px) {
				grid-template-columns: 1fr 1fr 1fr;
			}

			@media screen and (min-width: 1400px) {
				grid-template-columns: repeat(4, 1fr);
			}
		}

		mat-form-field {
			width: 100%;
		}
	`,
})
export class IdeaBoardComponent implements OnInit {
	private ideaService = inject(IdeaService);
	private fb = inject(FormBuilder);
	private userSettingsService = inject(UserSettingsService);

	ideas: Idea[] = [];
	user: UserSettings | null = null;
	ideaForm = this.fb.group({
		user: ['', Validators.required],
		title: ['', Validators.required],
		description: ['', Validators.required],
	});

	loadIdeas() {
		this.ideaService.findAll().subscribe({
			next: (ideas) => {
				this.ideas = ideas;
			},
		});
	}

	ngOnInit() {
		this.loadIdeas();
		this.userSettingsService.getSettings().subscribe({
			next: (user) => {
				this.user = user;
				this.ideaForm.get('user')?.setValue(user._id);
			},
		});
	}

	addIdea() {
		const idea: any = this.ideaForm.value;
		idea.votes = [];
		this.ideaService.create(idea).subscribe({
			next: () => {
				this.loadIdeas();
				this.ideaForm.setValue({
					user: idea.user,
					title: '',
					description: '',
				});
			},
		});
	}

	like(idea: Idea) {
		if (!this.user) return;

		const votes: { user: string; like: boolean }[] = idea.votes.filter(
			(v) => v.user != this.user?._id,
		);
		votes.push({
			user: this.user._id,
			like: true,
		});

		this.ideaService.update(idea._id, { votes }).subscribe({
			next: () => {
				this.loadIdeas();
			},
		});
	}

	dislike(idea: Idea) {
		if (!this.user) return;

		const votes: { user: string; like: boolean }[] = idea.votes.filter(
			(v) => v.user != this.user?._id,
		);
		votes.push({
			user: this.user._id,
			like: false,
		});

		this.ideaService.update(idea._id, { votes }).subscribe({
			next: () => {
				this.loadIdeas();
			},
		});
	}

	likes(idea: Idea) {
		return idea.votes.filter((v) => v.like === true).length;
	}

	dislikes(idea: Idea) {
		return idea.votes.filter((v) => v.like === false).length;
	}

	didIVoteIt(idea: Idea) {
		return idea.votes.some((v) => v.user === this.user?._id);
	}

	iLikedIt(idea: Idea) {
		return idea.votes.some(
			(v) => v.user === this.user?._id && v.like === true,
		);
	}

	iDislikedIt(idea: Idea) {
		return idea.votes.some(
			(v) => v.user === this.user?._id && v.like === false,
		);
	}
}
