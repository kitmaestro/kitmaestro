import { Injectable } from '@angular/core';
import { getSudoku } from 'sudoku-gen';
import { wordsearch } from '../lib';

@Injectable({
  providedIn: 'root'
})
export class GamesService {

  constructor() { }

  generateWordSearch(words: string[], size: { w: number, h: number }, opt?: any) {
    return wordsearch(words, size.w, size.h, opt);
  }

  generateSudoku(level: 'easy' | 'medium' | 'hard' | 'expert') {
    return getSudoku(level);
  }

  sudoku_string_to_board(board_string: string): Array<number | null>[] {
    const rows: Array<number | null>[] = [];
    let cur_row: Array<number | null> = [];
    const board = board_string.split('');

    board.forEach((el, i) => {
      cur_row.push(el == '-' ? null : +el);
      if (i % 9 == 8) {
        rows.push(cur_row);
        cur_row = [];
      }
    });
    const boxes: Array<number | null>[] = [
      [
        rows[0].slice(0, 3),
        rows[1].slice(0, 3),
        rows[2].slice(0, 3),
      ].flat(),
      [
        rows[0].slice(3, 6),
        rows[1].slice(3, 6),
        rows[2].slice(3, 6),
      ].flat(),
      [
        rows[0].slice(6),
        rows[1].slice(6),
        rows[2].slice(6),
      ].flat(),
      [
        rows[3].slice(0, 3),
        rows[4].slice(0, 3),
        rows[5].slice(0, 3),
      ].flat(),
      [
        rows[3].slice(3, 6),
        rows[4].slice(3, 6),
        rows[5].slice(3, 6),
      ].flat(),
      [
        rows[3].slice(6),
        rows[4].slice(6),
        rows[5].slice(6),
      ].flat(),
      [
        rows[6].slice(0, 3),
        rows[7].slice(0, 3),
        rows[8].slice(0, 3),
      ].flat(),
      [
        rows[6].slice(3, 6),
        rows[7].slice(3, 6),
        rows[8].slice(3, 6),
      ].flat(),
      [
        rows[6].slice(6),
        rows[7].slice(6),
        rows[8].slice(6),
      ].flat(),
    ];

    return boxes;
  }
}
