import { Component, OnInit } from '@angular/core';
import { Update } from '../interfaces/update';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    DatePipe,
  ],
  templateUrl: './updates.component.html',
  styleUrl: './updates.component.scss'
})
export class UpdatesComponent implements OnInit {
  public updates: Update[] = [
    {
      type: 'feature',
      date: new Date(2024, 7, 14),
      author: 'Otoniel Reyes Galay',
      title: 'Guardar y Exportar Planes',
      description: 'Los planes generados se pueden guardar y exportar',
      actions: [],
      content: `Ahora contamos con la opción de guardar los planes que has generado. Tanto las unidades de aprendizaje como los planes de clase (planes diarios).
En el generador, tienes un boton amarillo alineado a la derecha con el que podrás acceder a la lista de los planes que has guardado, para tenerlos siempre cerca.
Una vez guardado, puedes exportar tu plan como PDF y guardarlo para su uso offline o compartirlo con tus compañeros y superiores según tus necesidades.`,
    },
    {
      content: `Se ha lanzado la version 0.3 (beta #3) que ya (por fin) incluye generación de planes diarios totalmente funcional y una limitada versión preliminar del generador de unidades de aprendizaje que, por ahora, solo genera planes adecuados para primaria, y los contenidos de las áreas se siguen incluyendo pero a penas se han incluido los de Lengua Española para todos los grados de educación primaria y secundaria, se espera que para el 18 de agosto de 2024 se hayan completado ya los contenidos restantes.
También se ha incluido la version preliminar del generador de actividades. Este pretende ser un pilar para los maestros a los que nos gusta innovar pero no estamos dispuestos a perder todo el tiempo que conlleva pensar e investigar por nuestra cuenta para diseñar actividades nuevas e innovadoras. Esta utiliza inteligencia artificial para generar guías de lectura proveyendo el texto, la guía, recomendaciones y una rúbrica personalizada para evaluar el desempeño.
Los mas observadores notaran que ya no estan visibles las herramientas de generacion de calificaciones y asistencia, a pesar de que siguen activas y funcionando, de momento se han escondido de la vista.`,
      author: 'Otoniel Reyes Galay',
      date: new Date(2024, 7, 12),
      description: 'La version beta #3 (v0.3) se encuentra activa',
      title: 'Lanzamiento beta 3',
      type: 'feature',
      actions: [

      ],
    },
  ];

  ngOnInit() {
    console.log(this.updates)
  }
}
