import { Component } from '@angular/core';
import { createWorker } from 'tesseract.js';
import { AttendanceTableData } from '../../interfaces/attendance-table-data';
import { AttendanceRowTotals } from '../../interfaces/attendance-row-totals';
import { AttendanceColumnTotals } from '../../interfaces/attendance-column-totals';

@Component({
  selector: 'app-attendance-calc-assistant',
  standalone: true,
  imports: [],
  templateUrl: './attendance-calc-assistant.component.html',
  styleUrl: './attendance-calc-assistant.component.scss'
})
export class AttendanceCalcAssistantComponent {
  parsedTableData: any = {};
  rowTotals: any = {};
  columnTotals: any = {};

  async processImage(imageData: ImageData) {
    // Create a Tesseract worker
    const worker = await createWorker();
    await worker.load();
    // await worker.loadLanguage('eng');
    // await worker.initialize('eng');

    const { data: { text } } = await worker.recognize(imageData);

    // Parse the attendance table data from the OCR text
    const parsedTableData = this.parseAttendanceTable(text);

    // Calculate totals for rows and columns
    const rowTotals = this.calculateRowTotals(parsedTableData);
    const columnTotals = this.calculateColumnTotals(parsedTableData);

    // Update component state with parsed data and totals
    this.parsedTableData = parsedTableData;
    this.rowTotals = rowTotals;
    this.columnTotals = columnTotals;

    // Terminate the Tesseract worker
    await worker.terminate();
  }

  // Helper functions to parse attendance table data and calculate totals
  parseAttendanceTable(text: string): AttendanceTableData {
    return {} as AttendanceTableData;
  }

  calculateRowTotals(tableData: AttendanceTableData): AttendanceRowTotals {
    return {
      p: 1,
      t: 1,
    }
  }

  calculateColumnTotals(tableData: AttendanceTableData): AttendanceColumnTotals {
    return {
      a: 1,
      e: 1,
      p: 1,
      t: 1,
    }
  }

  onChange(e: any) {
    const { files } = e.target;
  }

}
