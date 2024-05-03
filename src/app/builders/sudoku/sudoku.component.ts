import { Component, inject } from '@angular/core';
import { SudokuService } from '../../services/sudoku.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sudoku } from 'sudoku-gen/dist/types/sudoku.type';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss'
})
export class SudokuComponent {

  sudokuService = inject(SudokuService);
  fb = inject(FormBuilder);

  sudokuLevel = this.fb.control('easy');
  sudoku: Sudoku | null = null;

  levels = [
    'easy',
    'medium',
    'hard',
    'expert'
  ];

  generate() {
    this.sudoku = this.sudokuService.generate(this.sudokuLevel.value as 'easy' | 'medium' | 'hard' | 'expert');
    this.stringToGrid(this.sudoku.puzzle);
  }

  stringToGrid(val: string) {
    const arr = val.split('');
    const board: Array<string[]> = [];

    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        board[i].push(arr[i + j]);
      }
    }

    console.log(board)
  }
}
