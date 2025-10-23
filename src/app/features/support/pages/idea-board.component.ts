import { Component, effect, inject, OnInit } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Idea } from '../../../core'
import { Store } from '@ngrx/store'
import { selectAuthUser, loadIdeas, createIdea, updateIdea } from '../../../store'
import { selectAllIdeas, selectIsCreating } from '../../../store/ideas/ideas.selectors'

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
				<div style="text-align: end">
					<button type="submit" mat-flat-button [disabled]="creating() || ideaForm.invalid" color="primary">
						Agregar
					</button>
				</div>
			</form>
		</div>

		<div class="grid">
			@for (idea of ideas(); track idea._id) {
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
							mat-button
							type="button"
							(click)="dislike(idea)"
							[style]="
								'margin-right: 12px;' +
								(iDislikedIt(idea)
									? 'background-color: #005cbb; color: white;'
									: '')
							"
						>
							<mat-icon>thumb_down</mat-icon> {{ dislikes(idea) }}
						</button>
						<button
							mat-button
							type="button"
							(click)="like(idea)"
							[style]="
								iLikedIt(idea)
									? 'background-color: #005cbb; color: white;'
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
	private fb = inject(FormBuilder)
	#store = inject(Store)

	ideas = this.#store.selectSignal(selectAllIdeas)
	user = this.#store.selectSignal(selectAuthUser)
	creating = this.#store.selectSignal(selectIsCreating)

	ideaForm = this.fb.group({
		user: ['', Validators.required],
		title: ['', Validators.required],
		description: ['', Validators.required],
	})

	loadIdeas() {
		this.#store.dispatch(loadIdeas())
	}

	constructor() {
		effect(() => {
			if (this.user()) {
				const id = this.user()?._id
				if (!id) return
				this.ideaForm.get('user')?.setValue(id)
			}
		})
	}

	ngOnInit() {
		this.loadIdeas()
	}

	addIdea() {
		const idea: any = this.ideaForm.value
		idea.votes = []
		this.#store.dispatch(createIdea({ idea }))
		this.ideaForm.setValue({ user: idea.user, title: '', description: '', })
	}

	like(idea: Idea) {
		const user = this.user()?._id
		if (!user) return

		const id = idea._id

		const votes = idea.votes.filter(
			(v) => v.user != user,
		)
		votes.push({
			user: user,
			like: true,
		})

		this.#store.dispatch(updateIdea({ id, data: { votes } }))
	}

	dislike(idea: Idea) {
		const user = this.user()?._id
		if (!user) return

		const id = idea._id

		const votes = idea.votes.filter(
			(v) => v.user != user,
		)
		votes.push({
			user: user,
			like: false,
		})

		this.#store.dispatch(updateIdea({ id, data: { votes } }))
	}

	likes(idea: Idea) {
		return idea.votes.filter((v) => v.like === true).length
	}

	dislikes(idea: Idea) {
		return idea.votes.filter((v) => v.like === false).length
	}

	didIVoteIt(idea: Idea) {
		return idea.votes.some((v) => v.user === this.user()?._id)
	}

	iLikedIt(idea: Idea) {
		return idea.votes.some(
			(v) => v.user === this.user()?._id && v.like === true,
		)
	}

	iDislikedIt(idea: Idea) {
		return idea.votes.some(
			(v) => v.user === this.user()?._id && v.like === false,
		)
	}
}
