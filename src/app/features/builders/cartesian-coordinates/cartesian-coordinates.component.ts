import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-cartesian-coordinates',
	imports: [
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatSnackBarModule,
		MatInputModule,
		MatSelectModule,
		MatFormFieldModule,
		ReactiveFormsModule,
	],
	templateUrl: './cartesian-coordinates.component.html',
	styleUrl: './cartesian-coordinates.component.scss',
})
export class CartesianCoordinatesComponent implements OnInit {
	private fb = inject(FormBuilder);
	private sb = inject(MatSnackBar);

	private svg = '';
	source = '';
	title = '';

	colors: { color: string; spanish: string; hex: string }[] = [
		{ color: 'black', spanish: 'Negro', hex: '#000000' },
		{ color: 'red', spanish: 'Rojo', hex: '#F44336' },
		{ color: 'pink', spanish: 'Rosa', hex: '#E91E63' },
		{ color: 'purple', spanish: 'Morado', hex: '#9C27B0' },
		{ color: 'deep purple', spanish: 'Morado oscuro', hex: '#673AB7' },
		{ color: 'indigo', spanish: 'Añil', hex: '#3F51B5' },
		{ color: 'blue', spanish: 'Azul', hex: '#2196F3' },
		{ color: 'light blue', spanish: 'Azul claro', hex: '#03A9F4' },
		{ color: 'cyan', spanish: 'Cian', hex: '#00BCD4' },
		{ color: 'teal', spanish: 'Verde azulado', hex: '#009688' },
		{ color: 'green', spanish: 'Verde', hex: '#4CAF50' },
		{ color: 'light green', spanish: 'Verde claro', hex: '#8BC34A' },
		{ color: 'lime', spanish: 'Lima', hex: '#CDDC39' },
		{ color: 'yellow', spanish: 'Amarillo', hex: '#FFEB3B' },
		{ color: 'amber', spanish: 'Ámbar', hex: '#FFC107' },
		{ color: 'orange', spanish: 'Naranja', hex: '#FF9800' },
		{ color: 'deep orange', spanish: 'Naranja oscuro', hex: '#FF5722' },
		{ color: 'brown', spanish: 'Marrón', hex: '#795548' },
		{ color: 'grey', spanish: 'Gris', hex: '#9E9E9E' },
		{ color: 'blue grey', spanish: 'Gris azulado', hex: '#607D8B' },
		{ color: 'magenta', spanish: 'Magenta', hex: '#E91E63' },
		{ color: 'olive', spanish: 'Oliva', hex: '#4CAF50' },
		{ color: 'maroon', spanish: 'Granate', hex: '#673AB7' },
		{ color: 'navy', spanish: 'Azul marino', hex: '#001F3F' },
		{ color: 'aquamarine', spanish: 'Aguamarina', hex: '#7FFFD4' },
		{ color: 'turquoise', spanish: 'Turquesa', hex: '#40E0D0' },
		{ color: 'silver', spanish: 'Plata', hex: '#C0C0C0' },
		{ color: 'gold', spanish: 'Oro', hex: '#FFD700' },
		{ color: 'violet', spanish: 'Violeta', hex: '#8A2BE2' },
	];

	exercises: string[] = [];

	generatorForm = this.fb.group({
		color: ['#000000'],
		max: [10, [Validators.min(1), Validators.max(100)]],
		steps: [1, [Validators.min(1), Validators.max(10)]],
		exercises: ['none'],
	});

	ngOnInit() {}

	onSubmit() {
		const data: any = this.generatorForm.value;
		this.svg = this.generateCartesianCoordinateSystem(
			data.max,
			data.steps,
			data.color,
		);
		this.source = `data:image/svg+xml;base64,${btoa(this.svg)}`;
		// generate exercises
		switch (data.exercises) {
			case 'integers': {
				this.exercises = this.generateIntegerExercises(data.max);
				this.title = 'Ubica estas coordenadas en el plano cartesiano';
				break;
			}
			case 'fractions': {
				this.exercises = this.generateFractionExercises(data.max);
				this.title = 'Ubica estas coordenadas en el plano cartesiano';
				break;
			}
			case 'decimals': {
				this.exercises = this.generateDecimalExercises(data.max);
				this.title = 'Ubica estas coordenadas en el plano cartesiano';
				break;
			}
			case 'irrationals': {
				break;
			}
			case 'functions': {
				this.title = 'Grafica estas funciones en el plano cartesiano';
				this.exercises = this.generateMathFunctions();
				break;
			}
			default: {
				this.title = '';
				this.exercises = [];
				break;
			}
		}
	}

	randBetween(min: number, max: number, decimals = false) {
		return decimals
			? (Math.random() * (max - min + 1) + min).toFixed(1)
			: Math.floor(Math.random() * (max - min + 1) + min);
	}

	generateIntegerExercises(max: number): string[] {
		const elements: string[] = [];
		const min = -max;

		for (let x = 0; x < 10; x++) {
			elements.push(
				`(${this.randBetween(min, max)}, ${this.randBetween(min, max)})`,
			);
		}

		return elements;
	}

	generateFractionExercises(max: number): string[] {
		const elements: string[] = [];
		const min = -max;

		for (let x = 0; x < 10; x++) {
			elements.push(
				`(${this.randBetween(min, max)}/${this.randBetween(min, max)}, ${this.randBetween(min, max)}/${this.randBetween(min, max)})`,
			);
		}

		return elements;
	}

	generateDecimalExercises(max: number): string[] {
		const elements: string[] = [];
		const min = -max;

		for (let x = 0; x < 10; x++) {
			elements.push(
				`(${this.randBetween(min, max, true)}, ${this.randBetween(min, max, true)})`,
			);
		}

		return elements;
	}

	generateMathFunctions(): string[] {
		const functions: string[] = [];
		const operators = ['+', '-', '*', '/'];
		const variables = ['x', 'y', 'z'];

		for (let i = 0; i < 10; i++) {
			let function_str = '';
			const num_terms = Math.floor(Math.random() * 3) + 1; // 1 to 3 terms

			for (let j = 0; j < num_terms; j++) {
				if (j > 0) {
					function_str += ` ${operators[Math.floor(Math.random() * operators.length)]} `;
				}

				const coefficient = Math.floor(Math.random() * 10) - 5; // -5 to 4
				const variable =
					variables[Math.floor(Math.random() * variables.length)];
				const exponent = Math.floor(Math.random() * 3) + 1; // 1 to 3

				function_str += `${coefficient < 0 ? '(' + coefficient + ')' : coefficient}*${variable}${exponent > 1 ? '<sup>' + exponent + '</sup>' : ''}`;
			}

			functions.push(function_str);
		}

		return functions;
	}

	generateCartesianCoordinateSystem(
		maxValue: number,
		steps: number,
		axisColor = 'black',
		gridColor = '#eee',
	): string {
		const xMax = maxValue;
		const yMax = maxValue;
		const xMin = xMax * -1;
		const yMin = yMax * -1;
		const width = xMax * 2 * 50;
		const height = yMax * 2 * 50;
		const gridSize = steps;
		const axisLineWidth = 2;
		const gridLineWidth = 1;
		const xScale = (width - 2 * axisLineWidth) / (xMax - xMin);
		const yScale = (height - 2 * axisLineWidth) / (yMax - yMin);
		const midX = width / 2;
		const midY = height / 2;

		let svg = `<svg style="background-color: white;" width="${width}" height="${height}" viewBox="-20 -20 ${width + 40} ${height + 40}" xmlns="http://www.w3.org/2000/svg">`;

		// Draw grid
		for (let x = xMin; x <= xMax; x += gridSize) {
			const xPos = axisLineWidth + (x - xMin) * xScale;
			svg += `<line x1="${xPos}" y1="${axisLineWidth}" x2="${xPos}" y2="${height - axisLineWidth}" stroke="${gridColor}" stroke-width="${gridLineWidth}" />`;
		}

		for (let y = yMin; y <= yMax; y += gridSize) {
			const yPos = height - axisLineWidth - (y - yMin) * yScale;
			svg += `<line x1="${axisLineWidth}" y1="${yPos}" x2="${width - axisLineWidth}" y2="${yPos}" stroke="${gridColor}" stroke-width="${gridLineWidth}" />`;
		}

		// Draw axes
		svg += `<rect x="-15" y="${height / 2}" height="${axisLineWidth}" width="${width + 30}" fill="${axisColor}" />`;
		svg += `<rect x="${width / 2}" y="-15" width="${axisLineWidth}" height="${height + 30}" fill="${axisColor}" />`;
		// arrows
		// left
		svg += `<polygon points="-4,${midY - 8} -20,${midY + 1} -4,${midY + 11}" fill="${axisColor}" />`;
		// right
		svg += `<polygon points="${width + 4},${midY - 8} ${width + 20},${midY + 1} ${width + 4},${midY + 11}" fill="${axisColor}" />`;
		// up
		svg += `<polygon points="${midX - 8},-4 ${midX + 1},-20 ${midX + 11},-4" fill="${axisColor}" />`;
		// down
		svg += `<polygon points="${midX - 8},${height + 4} ${midX + 1},${height + 20} ${midX + 11},${height + 4}" fill="${axisColor}" />`;
		// centered circle
		svg += `<circle cx="${midX + 1}" cy="${midY + 1}" r="8" fill="${axisColor}" />`;
		// vertical lines
		for (let x = xMin; x <= xMax; x += steps) {
			if (x === 0) continue;
			const xPos = axisLineWidth + (x - xMin) * xScale;
			svg += `<text x="${xPos}" y="${midY - 16}" fill="${axisColor}">${x}</text>`;
			svg += `<rect x="${xPos}" y="${midY - 7}" width="${axisLineWidth}" height="16" fill="${axisColor}" />`;
		}
		// horizontal lines
		for (let y = yMin; y <= yMax; y += steps) {
			if (y === 0) continue;
			const yPos = axisLineWidth + (y - yMin) * yScale;
			svg += `<text y="${yPos + 6}" x="${midX + 16}" fill="${axisColor}">${y * -1}</text>`;
			svg += `<rect y="${yPos}" x="${midX - 7}" width="16" height="${axisLineWidth}" fill="${axisColor}" />`;
		}

		svg += '</svg>';
		return svg;
	}
}
