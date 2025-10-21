import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
	selector: 'app-average-calculator',
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatListModule,
		MatChipsModule,
	],
	template: `
		<h2 style="font-size: 24pt; margin-bottom: 24px">
			Calculadora de Promedios
		</h2>

		<div class="wrapper">
			<div class="calculator-frame">
				<div class="calculator-container">
					<div class="screen">
						<div class="history">
							({{ history.join(' + ') || 0 }}) /
							{{ history.length }} =
							{{ average(history) }}
						</div>
						<div class="current">
							({{ currentCalculation.join(' + ') || 0 }}) /
							{{ currentCalculation.length }} =
							{{ average(currentCalculation) }}
						</div>
						<div class="value">
							{{ screenValue || 0 }}
						</div>
					</div>
					<div class="keyboard">
						<div class="numberpad">
							<button
								color="link"
								mat-fab
								*ngFor="let key of numberKeys"
								class="key number"
								type="button"
								(click)="addNumber(key.value)"
							>
								{{ key.label }}
							</button>
							<button
								color="link"
								mat-fab
								class="key number"
								type="button"
								(click)="addPeriod()"
							>
								.
							</button>
							<button
								color="link"
								mat-fab
								class="key number"
								type="button"
								(click)="addNumber(0)"
							>
								0
							</button>
							<button
								color="link"
								mat-fab
								class="key number"
								type="button"
								(click)="sendGrade()"
							>
								<mat-icon>send</mat-icon>
							</button>
							<button
								color="link"
								mat-fab
								class="key number"
								type="button"
								(click)="reset()"
							>
								<mat-icon>arrow_upward</mat-icon>
							</button>
							<button
								color="link"
								mat-fab
								class="key number"
								type="button"
								(click)="clearScreen()"
							>
								C
							</button>
							<button
								color="link"
								mat-fab
								class="key number"
								type="button"
								(click)="backspace()"
							>
								<mat-icon>backspace</mat-icon>
							</button>
						</div>
					</div>
				</div>
			</div>

			<div class="hide-under-md">
				<h2>Controles</h2>
				<mat-list>
					<mat-list-item>
						<mat-chip>0 - 9</mat-chip> Insertar N&uacute;mero
					</mat-list-item>
					<mat-list-item>
						<mat-chip>.</mat-chip> Insertar Punto
					</mat-list-item>
					<mat-list-item>
						<mat-chip
							><mat-icon>keyboard_return</mat-icon></mat-chip
						>
						Agregar Calificaci&oacute;n
					</mat-list-item>
					<mat-list-item>
						<mat-chip><mat-icon>space_bar</mat-icon></mat-chip>
						Nuevo C&aacute;lculo
					</mat-list-item>
					<mat-list-item>
						<mat-chip>Esc</mat-chip> Limpiar Pantalla
					</mat-list-item>
					<mat-list-item>
						<mat-chip><mat-icon>backspace</mat-icon></mat-chip>
						Borrar
					</mat-list-item>
				</mat-list>
			</div>
		</div>
	`,
	styles: `
		.calculator-frame {
			width: 100%;
			max-width: 320px;
			padding: 12px;
			// background-color: #673ab7;
			// background-color: #ffd740;
			background-color: #005cbb;
			border-radius: 12px;
			margin-bottom: 24px;
		}

		.calculator-container {
			.screen {
				background-color: #fff;
				text-align: end;
				padding: 6px 12px;
				border-radius: 12px;
				margin-bottom: 12px;

				.history {
					text-align: end;
					color: #ddd;
					font-size: 16px;
				}

				.current {
					text-align: end;
					color: #222;
					font-size: 20px;
				}

				.value {
					line-height: 1.5;
					font-size: 42pt;
					font-weight: bold;
				}
			}

			.keyboard {
				.numberpad {
					display: grid;
					gap: 16px;
					grid-template-columns: repeat(3, 1fr);
				}
				.key.number {
					margin: 0 auto;
					display: block;
				}
			}
		}

		.hide-under-md {
			@media screen and (max-width: 720px) {
				display: none;
			}
		}

		.wrapper {
			display: flex;
			gap: 16px;
		}
	`,
})
export class AverageCalculatorComponent {
	history: number[] = [];
	currentCalculation: number[] = [];
	screenValue = '';

	numberKeys: { label: string; value: number }[] = [
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '4', value: 4 },
		{ label: '5', value: 5 },
		{ label: '6', value: 6 },
		{ label: '7', value: 7 },
		{ label: '8', value: 8 },
		{ label: '9', value: 9 },
	];

	constructor() {
		window.addEventListener('keydown', (event: KeyboardEvent) => {
			switch (event.key.toLowerCase()) {
				case 'enter': {
					this.sendGrade();
					break;
				}
				case 'escape': {
					this.clearScreen();
					break;
				}
				case 'backspace': {
					this.backspace();
					break;
				}
				case ' ': {
					this.reset();
					break;
				}
				case '.': {
					this.addPeriod();
					break;
				}
				default: {
					const value = parseInt(event.key);
					if (value >= 0) {
						this.addNumber(value);
					}
					break;
				}
			}
		});
	}

	addNumber(value: number) {
		if (value === 0 && this.screenValue === '0') return;
		this.screenValue += value;
	}

	addPeriod() {
		if (!this.screenValue.includes('.')) {
			if (this.screenValue === '') {
				this.screenValue += 0;
			}
			this.screenValue += '.';
		}
	}

	clearScreen() {
		this.screenValue = '';
	}

	sendGrade() {
		const value = parseFloat(this.screenValue);
		this.currentCalculation.push(value);
		this.clearScreen();
	}

	backspace() {
		const end = this.screenValue.length - 1;
		this.screenValue = this.screenValue.slice(0, end);
	}

	average(row: number[]) {
		return row.length
			? Math.round(row.reduce((l, n) => l + n, 0) / row.length)
			: 0;
	}

	reset() {
		this.clearScreen();
		this.history = this.currentCalculation;
		this.currentCalculation = [];
	}
}
