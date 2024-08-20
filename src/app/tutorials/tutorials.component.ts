import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface TutorialVideo {
  title: string;
  description: string;
  url: string;
  time: string;
  author: string;
  authorLink: string;
}

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './tutorials.component.html',
  styleUrl: './tutorials.component.scss'
})
export class TutorialsComponent {
  tutorials: TutorialVideo[] = [];
}
