import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-builder-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './builder-list.component.html',
  styleUrl: './builder-list.component.scss'
})
export class BuilderListComponent {
  builders: Array<{
    title: string,
    description: string,
    list: {
      name: string;
      description: string;
      link: string[],
      cover: string,
    }[]
  }> = [
    {
      title: 'Juegos',
      description: 'Generadores de Hojas de Juego para tus alumnos',
      list: [
        {
          name: 'Sudoku',
          description: 'Genera Hojas de Sudoku de diferentes niveles de dificultad con sus respectivas respuestas.',
          link: [
            '/app',
            'worksheet-builders',
            'sudoku'
          ],
          cover: '/assets/undraw_game_day_ucx9.svg'
        },
        {
          name: 'Sopas de Letras',
          description: 'Genera sopas de letras con diferentes niveles de dificultad y sus respuestas.',
          link: [
            '/app',
            'worksheet-builders',
            'wordsearch'
          ],
          cover: '/assets/undraw_file_searching_re_3evy.svg'
        },
      ]
    },
  ];
}
