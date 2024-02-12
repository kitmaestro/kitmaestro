import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-average-calculator',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
  ],
  templateUrl: './average-calculator.component.html',
  styleUrl: './average-calculator.component.scss'
})
export class AverageCalculatorComponent {
  history: number[] = [];
  currentCalculation: number[] = [];
  screenValue = '';

  numberKeys: { label: string, value: number }[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
  ]

  constructor() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      switch(event.key.toLowerCase()) {
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
          if (value) {
            this.addNumber(value);
          }
          break;
        }
      }
    })
  }

  addNumber(value: number) {
    if (value == 0 && this.screenValue == '0') return;
    this.screenValue += value;
  }

  addPeriod() {
    if (!this.screenValue.includes('.')) {
      if (this.screenValue == '') {
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
    return row.length ? Math.round(row.reduce((l,n) => l + n, 0) / row.length) : 0;
  }

  reset() {
    this.clearScreen();
    this.history = this.currentCalculation;
    this.currentCalculation = [];
  }
}
