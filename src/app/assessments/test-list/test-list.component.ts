import { Component, inject } from '@angular/core';
import { Test } from '../../interfaces/test';
import { TestService } from '../../services/test.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TestComponent } from '../test/test.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-test-list',
	imports: [
		MatDialogModule,
		MatCardModule,
		MatButtonModule,
		MatTableModule,
		MatIconModule,
		RouterLink,
  ],
  templateUrl: './test-list.component.html',
  styleUrl: './test-list.component.scss'
})
export class TestListComponent {
	testService = inject(TestService);
	dialog = inject(MatDialog);

	tests: Test[] = [];

	columns = ['grade', 'subject', 'actions'];

	load() {
		this.testService.findAll().subscribe({
			next: tests => {
				this.tests = tests;
			}
		});
	}

	ngOnInit() {
		this.load();
	}

	delete(id: string) {
		this.testService.delete(id).subscribe(res => {
			if (res.deletedCount > 0)
				this.load();
		});
	}

	open(test: Test) {
		this.dialog.open(TestComponent, {
			data: test
		});
	}
}
