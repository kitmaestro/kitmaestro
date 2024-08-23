import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-builder-list',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatCardModule,
    MatButtonModule,
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
      title: 'Lengua Española',
      description: 'Generadores de hojas de trabajo para desarrollar competencias de lectoescritura.',
      list: [
        {
          name: 'Ordena las Palabras',
          description: 'Genera palabras desordenadas para ordenar.',
          link: [
            '/app',
            'worksheet-builders',
            'word-scramble'
          ],
          cover: '/assets/undraw_specs_re_546x.svg'
        },
        {
          name: 'Parea Sinónimos',
          description: 'Genera hojas de ejercicios para parear sinónimos.',
          link: [
            '/app',
            'worksheet-builders',
            'synonyms'
          ],
          cover: '/assets/undraw_file_searching_re_3evy.svg'
        },
        {
          name: 'Parea Antónimos',
          description: 'Genera hojas de ejercicios para parear antónimos.',
          link: [
            '/app',
            'worksheet-builders',
            'antonyms'
          ],
          cover: '/assets/undraw_file_searching_re_3evy.svg'
        },
        {
          name: 'Crucigramas',
          description: 'Genera crucigramas para tus alumnos.',
          link: [
            '/app',
            'worksheet-builders',
            'crosswords'
          ],
          cover: '/assets/undraw_file_searching_re_3evy.svg'
        },
        {
          name: 'Sopas de Letras',
          description: 'Genera sopas de letras por niveles y respuestas.',
          link: [
            '/app',
            'worksheet-builders',
            'wordsearch'
          ],
          cover: '/assets/undraw_file_searching_re_3evy.svg'
        },
      ]
    },
    {
      title: 'Matemáticas',
      description: 'Generadores de Hojas de ejercicios de matemática.',
      list: [
        {
          name: 'Suma',
          description: 'Genera Hojas de suma con hoja de respuestas.',
          link: [
            '/app',
            'worksheet-builders',
            'addition'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'Resta',
          description: 'Genera Hojas de resta con hoja de respuestas.',
          link: [
            '/app',
            'worksheet-builders',
            'subtraction'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'Multiplicación',
          description: 'Genera Hojas de multiplicación con sus respuestas.',
          link: [
            '/app',
            'worksheet-builders',
            'multiplication'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'División',
          description: 'Genera Hojas de división con hoja de respuestas.',
          link: [
            '/app',
            'worksheet-builders',
            'division'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'Ejercicios Mixtos',
          description: 'Genera ejercicios mixtos de operaciones basicas.',
          link: [
            '/app',
            'worksheet-builders',
            'mixed-operations'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'Ecuaciones',
          description: 'Ejercicios con ecuaciones',
          link: [
            '/app',
            'worksheet-builders',
            'equations'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'Papel Cuadriculado',
          description: 'Genera Hojas cuadriculadas para geometría.',
          link: [
            '/app',
            'worksheet-builders',
            'graph-paper'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'Recta Numérica',
          description: 'Genera Hojas de ejercicios con la recta numérica.',
          link: [
            '/app',
            'worksheet-builders',
            'number-line'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
        {
          name: 'Planos Cartesianos',
          description: 'Genera Hojas con plantillas de planos cartesianos.',
          link: [
            '/app',
            'worksheet-builders',
            'cartesian-coordinates'
          ],
          cover: '/assets/undraw_new_entries_re_cffr.svg'
        },
      ]
    },
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
          name: 'Crucigramas',
          description: 'Genera crucigramas para tus alumnos.',
          link: [
            '/app',
            'worksheet-builders',
            'crosswords'
          ],
          cover: '/assets/undraw_file_searching_re_3evy.svg'
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
