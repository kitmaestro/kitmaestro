import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { YouTubePlayer } from '@angular/youtube-player';

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
    imports: [
        MatCardModule,
        MatButtonModule,
        YouTubePlayer,
    ],
    templateUrl: './tutorials.component.html',
    styleUrl: './tutorials.component.scss'
})
export class TutorialsComponent {
  tutorials: TutorialVideo[] = [];
}
