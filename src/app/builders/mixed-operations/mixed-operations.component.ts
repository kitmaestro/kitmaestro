import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MathExerciseComponent } from '../../ui/math-exercise.component';
import { AuthService } from '../../services/auth.service';
import { PdfService } from '../../services/pdf.service';

export type MathOperationType = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface MathOperation {
    type: MathOperationType;
    operands: number[];
}

export interface MathExercise {
    operations: MathOperation[];
}

@Component({
    selector: 'app-mixed-operations',
    imports: [
        MatCardModule,
        MatInputModule,
        MatChipsModule,
        MatButtonModule,
        MatSelectModule,
        MatSnackBarModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MathExerciseComponent,
    ],
    templateUrl: './mixed-operations.component.html',
    styleUrl: './mixed-operations.component.scss'
})
export class MixedOperationsComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private pdfService = inject(PdfService);
    private sb = inject(MatSnackBar);

    schoolName = '';
    teacherName = '';

    generatorForm = this.fb.group({
        digits: [2],
        size: [10],
        name: [false],
        grade: [false],
        date: [false],
    })
    exercises: MathExercise[] = []

    ngOnInit() {
        this.authService.profile().subscribe(user => {
            this.teacherName = `${user.title}. ${user.firstname} ${user.lastname}`
        });
    }

    onSubmit() {
        const formData: any = this.generatorForm.value;
        this.exercises = this.generateMathExercises(formData.size);
    }

    generateMathExercises(n: number): MathExercise[] {
        const exercises: MathExercise[] = [];

        for (let i = 0; i < n; i++) {
            const exercise: MathExercise = {
                operations: []
            };

            const numOperations = Math.floor(Math.random() * 4) + 2; // Generate 1 to 3 operations per exercise

            for (let j = 0; j < numOperations; j++) {
                const operation: MathOperation = {
                    type: (['addition', 'subtraction', 'multiplication', 'division'] as MathOperationType[])[Math.floor(Math.random() * 4)],
                    operands: []
                };

                const numOperands = Math.floor(Math.random() * 1) + 1; // Generate 2 to 4 operands per operation

                for (let k = 0; k < numOperands; k++) {
                    operation.operands.push(Math.floor(Math.random() * 100) + 1); // Generate random operands between 0 and 99
                }

                exercise.operations.push(operation);
            }

            exercises.push(exercise);
        }

        console.log(exercises)

        return exercises;
    }

    calculate(exercise: MathExercise): number {
        let result = 0;
        const operands: number[][] = exercise.operations.map(o => o.operands)
        const operations = exercise.operations.flatMap(o => o.type);

        operands.forEach((operand, i) => {
            for (const n of operand) {
                switch (operations[i]) {
                    case 'addition':
                        result = result + n;
                        break;
                    case 'subtraction':
                        result = result - n;
                        break;
                    case 'multiplication':
                        result = result === 0 ? n : result * n;
                        break;
                    case 'division':
                        result = result === 0 ? n : (n > 0 ? result / n : 0);
                        break;
                }
            }
        });

        return result;
    }

    toggleName() {
        const val = this.generatorForm.get('name')?.value;
        if (!val) {
            this.generatorForm.get('name')?.setValue(true);
        } else {
            this.generatorForm.get('name')?.setValue(false);
        }
    }

    toggleGrade() {
        const val = this.generatorForm.get('grade')?.value;
        if (!val) {
            this.generatorForm.get('grade')?.setValue(true);
        } else {
            this.generatorForm.get('grade')?.setValue(false);
        }
    }

    toggleDate() {
        const val = this.generatorForm.get('date')?.value;
        if (!val) {
            this.generatorForm.get('date')?.setValue(true);
        } else {
            this.generatorForm.get('date')?.setValue(false);
        }
    }

    getOperatorSymbol(type: string): string {
        switch (type) {
            case 'addition':
                return '+';
            case 'subtraction':
                return '-';
            case 'multiplication':
                return '×';
            case 'division':
                return '÷';
            default:
                return '';
        }
    }

    print() {
        this.sb.open('Imprimiendo como PDF!, por favor espera un momento.', undefined, { duration: 5000 });
        this.pdfService.createAndDownloadFromHTML("exercises", `Ejercicios mixtos`);
        this.pdfService.createAndDownloadFromHTML("exercises-solution", `Ejercicios mixtos - Solucion`);
    }
}
