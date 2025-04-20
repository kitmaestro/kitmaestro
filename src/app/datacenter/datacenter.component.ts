import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { ClassSection } from '../interfaces/class-section';

@Component({
	selector: 'app-datacenter',
	standalone: true,
	imports: [MatCardModule, MatTableModule, RouterModule],
	templateUrl: './datacenter.component.html',
	styleUrl: './datacenter.component.scss',
})
export class DatacenterComponent implements OnInit {
	sections: Observable<ClassSection[]> = EMPTY;

	sectionsColumns = ['name', 'level', 'grade', 'subjects'];

	ngOnInit(): void {}

	addSection(section: ClassSection) {}

	removeSection(section: ClassSection) {}

	updateSection(section: ClassSection, updated: any) {}
}
