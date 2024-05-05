import { Component, inject } from '@angular/core';
import { SudokuService } from '../../services/sudoku.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sudoku } from 'sudoku-gen/dist/types/sudoku.type';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
  ],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss'
})
export class SudokuComponent {

  sudokuService = inject(SudokuService);
  fb = inject(FormBuilder);

  sudokuLevel = this.fb.control('easy');
  sudokuTitle = this.fb.control('Sudoku');
  sudokuIncludeSolution = this.fb.control(true);
  sudokuFields = this.fb.group({
    name: [true],
    grade: [true],
    date: [true],
  });

  sudoku: Sudoku | null = null;
  board: Array<number | null>[] = [];
  solvedBoard: Array<number | null>[] = [];

  levels = [
    {
      level: 'easy',
      label: 'Facil',
    },
    {
      level: 'medium',
      label: 'Medio',
    },
    {
      level: 'hard',
      label: 'Dificil',
    },
    {
      level: 'expert',
      label: 'Experto',
    }
  ];

  generate() {
    this.sudoku = this.sudokuService.generate(this.sudokuLevel.value as 'easy' | 'medium' | 'hard' | 'expert');
    this.board = this.sudokuService.string_to_board(this.sudoku.puzzle);
    this.solvedBoard = this.sudokuService.string_to_board(this.sudoku.solution);
  }

  toggleName() {
    const current = this.sudokuFields.get('name')?.value || false;
    this.sudokuFields.get('name')?.setValue(!current);
  }

  toggleGrade() {
    const current = this.sudokuFields.get('grade')?.value || false;
    this.sudokuFields.get('grade')?.setValue(!current);
  }

  toggleDate() {
    const current = this.sudokuFields.get('date')?.value || false;
    this.sudokuFields.get('date')?.setValue(!current);
  }
}
