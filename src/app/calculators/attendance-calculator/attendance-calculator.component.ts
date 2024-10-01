import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-attendance-calculator',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './attendance-calculator.component.html',
  styleUrl: './attendance-calculator.component.scss'
})
export class AttendanceCalculatorComponent implements OnInit {
  fb = inject(FormBuilder);

  dataSet: { qty: number, percentage: string, fixed: string }[] = []
  labels = ['attendance', 'percentage', 'fixed'];

  days = this.fb.control(12);

  ngOnInit() {
    this.calculate()
  }

  calculate() {
    const days = this.days.value;
    this.dataSet = [];
    if (days) {
      for (let i = 1; i <= days; i++) {
        const percentage = (i * 100) / days;
        this.dataSet.push({ qty: i, percentage: percentage.toFixed(2) + '%', fixed: Math.round(percentage) + '%' });
      }
    }
  }

  less() {
    const { value } = this.days;
    if (!value) return;
    this.days.setValue(value - 1);
    this.calculate()
  }

  plus() {
    const { value } = this.days;
    this.days.setValue(value ? value + 1 : 1);
    this.calculate()
  }
}
