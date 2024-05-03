import { Injectable } from '@angular/core';
import { getSudoku } from 'sudoku-gen';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  constructor() { }

  generate(level: 'easy' | 'medium' | 'hard' | 'expert') {
    return getSudoku(level);
  }
}
