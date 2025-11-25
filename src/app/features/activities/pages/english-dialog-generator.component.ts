import { Component, inject } from '@angular/core';
import { IsPremiumComponent } from '../../../shared/ui/is-premium.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AiService } from '../../../core/services/ai.service';
import { MatButtonModule } from '@angular/material/button';
import { kindergartenDialogs } from '../../../core/data/kindergarten-conversations';
import { EnglishConversation } from '../../../core';
import { easySpeakConversations } from '../../../core/data/easyspeak-conversations';
import { easyDialogsConversations } from '../../../core/data/easydialogs-conversations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-english-dialog-generator',
	imports: [
		IsPremiumComponent,
		ReactiveFormsModule,
		MatSlideToggleModule,
		MatFormFieldModule,
		MatSnackBarModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatInputModule,
		MatCardModule,
	],
	template: `
		<app-is-premium>
			<div>
				<div>
					<h2>Generador de Conversaciones en Ingl&eacute;s</h2>
				</div>
				<div>
					<form [formGroup]="generatorForm" (ngSubmit)="onSubmit()">
						<div
							style="
								display: grid;
								gap: 12px;
								grid-template-columns: 1fr 1fr;
							"
						>
							<mat-form-field appearance="outline">
								<mat-label>Nivel</mat-label>
								<mat-select formControlName="level">
									@for (level of dialogLevels; track $index) {
										<mat-option [value]="$index">{{
											level
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
							<mat-form-field appearance="outline">
								<mat-label>Tema</mat-label>
								<mat-select formControlName="topic">
									@for (topic of topics; track $index) {
										<mat-option [value]="topic">{{
											topic
										}}</mat-option>
									}
								</mat-select>
							</mat-form-field>
						</div>
						<mat-slide-toggle
							style="margin-top: 12px; margin-bottom: 24px"
							formControlName="useAi"
							>Utilizar Inteligencia Artificial
							<small style="color: #888"
								>*Esta es una opci&oacute;n que a&uacute;n
								est&aacute; en desarrollo. Ten cuidado.*</small
							></mat-slide-toggle
						>
						<div>
							<button
								[disabled]="generating"
								mat-flat-button
								color="primary"
								type="submit"
							>
								<mat-icon>bolt</mat-icon>
								{{
									generating
										? 'Generando...'
										: conversation
											? 'Regenerar'
											: 'Generar'
								}}
							</button>
						</div>
					</form>
				</div>
			</div>
			@if (conversation) {
				<div style="margin-top: 24px">
					<div>
						<h2>{{ conversation.title }}</h2>
					</div>
					<div>
						<div class="conversation">
							@for (line of conversation.talk; track $index) {
								<div [class.a]="line.a" [class.b]="line.b">
									<b>{{ line.a ? 'A' : 'B' }}</b
									>: {{ line.a ? line.a : line.b }}
								</div>
							}
						</div>
					</div>
				</div>
			}
		</app-is-premium>
	`,
	styles: `
		.conversation {
			margin: 0;
			padding: 0;

			div {
				margin: 0;
				padding: 0;
			}
		}
	`,
})
export class EnglishDialogGeneratorComponent {
	fb = inject(FormBuilder);
	sb = inject(MatSnackBar);
	aiService = inject(AiService);

	generating = false;
	conversation: EnglishConversation | null = null;

	dialogLevels = ['Kindergarten', 'Elementary', 'Intermediate'];

	generatorForm = this.fb.group({
		level: [0, Validators.required],
		topic: [''],
		useAi: [false],
	});

	get topics(): string[] {
		const { level } = this.generatorForm.value;
		if (level === 1) {
			return easySpeakConversations
				.map((d) => d.topic)
				.reduce((prev: string[], curr: string) => {
					if (prev.includes(curr)) {
						return prev;
					} else {
						prev.push(curr);
						return prev;
					}
				}, [] as string[]);
		} else if (level === 2) {
			return easyDialogsConversations
				.map((d) => d.topic)
				.reduce((prev: string[], curr: string) => {
					if (prev.includes(curr)) {
						return prev;
					} else {
						prev.push(curr);
						return prev;
					}
				}, [] as string[]);
		}
		return [];
	}

	randomKinderDialog(): EnglishConversation {
		const index = Math.round(
			Math.random() * (kindergartenDialogs.length - 1),
		);
		return kindergartenDialogs[index];
	}

	randomEasySpeakDialog(topic?: string): EnglishConversation {
		const filtered = topic
			? easySpeakConversations.filter((c) => c.topic === topic)
			: easyDialogsConversations;
		const index = Math.round(Math.random() * (filtered.length - 1));
		const dialog = filtered[index];
		dialog.talk.sort((a, b) => a.id - b.id);
		return dialog;
	}

	randomEasyDialog(topic?: string): EnglishConversation {
		const filtered = topic
			? easyDialogsConversations.filter((c) => c.topic === topic)
			: easyDialogsConversations;
		const index = Math.round(Math.random() * (filtered.length - 1));
		const dialog = filtered[index];
		dialog.talk.sort((a, b) => a.id - b.id);
		return dialog;
	}

	generateConversationWithAI(topic: string, level: string, lines = 8) {
		this.aiService
			.geminiAi(
				`Write a ${level.toLowerCase()} level conversation between A and B about ${topic || 'anything'} with ${lines / 2} for each one. Your response must be a valid JSON with this interface: { dialog: { order: number, a?: string, b?: string }[], title: string }`,
			)
			.subscribe({
				next: (result) => {
					try {
						const { response } = result;
						const extract = response.slice(
							response.indexOf('{'),
							response.lastIndexOf('}') + 1,
						);
						console.log(extract);
						const conversation = JSON.parse(extract) as {
							dialog: { order: number; a?: string; b?: string }[];
							title: string;
						};
						console.log(conversation);
						this.conversation = {
							id: 0,
							level: this.generatorForm.get('level')?.value || 1,
							talk: conversation.dialog.map((d) => ({
								...d,
								id: d.order,
							})),
							title: conversation.title,
							topic,
						};
						this.generating = false;
					} catch (error) {
						this.sb.open(
							'Hubo un error generando la conversación.',
							'Ok',
							{ duration: 3000 },
						);
						console.log(error);
						this.generating = false;
					}
				},
				error: (err) => {
					this.sb.open(
						'Hubo un error generando la conversación.',
						'Ok',
						{ duration: 3000 },
					);
					console.log(err.message);
					this.generating = false;
				},
			});
	}

	onSubmit() {
		const { level, useAi, topic } = this.generatorForm.value;
		this.generating = true;

		const topics = [
			'Jobs',
			'School',
			'Housing',
			'Bus',
			'Network',
			'Bank',
			'Dating',
			'Driving',
			'Shop',
			'Sports',
			'Social',
			'Daily Life',
			'Family',
			'Food',
			'Eat Outside',
			'Health',
			'Nature',
			'Safety',
			'Voting',
			'Daily Life',
			'School Life',
			'Transportation',
			'Entertainment',
			'Dating',
			'Restaurant',
			'Sports',
			'Safety',
			'Travel',
			'Jobs',
			'Food',
			'Housing',
			'Health',
		];

		const pickedTopic = topic
			? topic
			: topics[Math.round(Math.random() * (topics.length - 1))];

		if (useAi) {
			this.generateConversationWithAI(
				pickedTopic.toLowerCase(),
				this.dialogLevels[level || 0],
				level === 0 ? 8 : level === 1 ? 12 : 16,
			);
		} else {
			if (level === 0) {
				this.conversation = this.randomKinderDialog();
				this.generating = false;
			} else if (level === 1) {
				this.conversation = this.randomEasySpeakDialog(pickedTopic);
				this.generating = false;
			} else {
				this.conversation = this.randomEasyDialog(pickedTopic);
				this.generating = false;
			}
		}
	}
}
