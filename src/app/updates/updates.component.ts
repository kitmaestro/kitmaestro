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
      type: 'notice',
      date: new Date(2024, 7, 22),
      author: 'Otoniel Reyes Galay',
      title: 'Planes para educación primaria completa',
      description: 'Actualización de Contenidos',
      actions: [
      ],
      links: [
      ],
      content: `Ya se han subido la totalidad de contenidos de educación primaria. Finalmente se han agregado todos los contenidos de Matemáticas y Ciencias de la Naturaleza.
La siguiente etapa es la incorporación de las guias de secuencias didacticas de Lengua Española (segundo ciclo) y la integración de las guías con base de lengua española y Matemática (primer ciclo).
Una vez completado esto, se procederá a integrar la malla curricular actualizada para educación secundaria.
Cada vez estamos mas cerca, mantente atento para saber lo último.`,
    },
    {
      type: 'notice',
      date: new Date(2024, 7, 22),
      author: 'Otoniel Reyes Galay',
      title: 'Nuevos contenidos completados',
      description: 'Actualización de Contenidos',
      actions: [
      ],
      links: [
      ],
      content: `Ya se han subido la totalidad de contenidos de Formación Integral Humana y Religiosa, el 50% de los contenidos de Matemáticas y se ha arreglado un error detectado en Educación Artística.
El día de hoy, se procederá a la culminación de la subida de los contenidos de Matemáticas para el nivel primario.
Cada vez estamos mas cerca, mantente atento para saber lo último.`,
    },
    {
      type: 'feature',
      date: new Date(2024, 7, 22),
      author: 'Otoniel Reyes Galay',
      title: 'Lista de Pendientes',
      description: 'Nueva Herramienta: Lista de Pendientes',
      actions: [
        {
          link: [
            '/app',
            'todos'
          ],
          label: 'Lista de Pendientes'
        },
        {
          link: [
            '/app',
            'roadmap'
          ],
          label: 'Todas la Herramientas'
        },
      ],
      links: [
        {
          external: true,
          label: "WhatsApp del Creador",
          link: "https://wa.me/+18094659650"
        }
      ],
      content: `Hoy le damos la bienvenida a una nueva herramienta que esperamos sea muy útil para nuestros usuarios.
Se trata de una herramienta gratuita, así que no es necesaria la suscripción premium para utilizarla.
Con esta herramienta puedes organizar mejor tu día a día dentro y fuera del aula, obteniendo una vista rápida y ágil de lo que te espera y lo que haz realizado ya.
Pruebala hoy mismo!
Recuerda que puedes solicitar las herramientas que sientes que nos hacen falta y reportar cualquier error con el que te topes, la vía más fácil es el WhatsApp del creador: +1809-465-9650`,
    },
    {
      type: 'feature',
      date: new Date(2024, 7, 21),
      author: 'Otoniel Reyes Galay',
      title: 'Sistema de Referidos Activo',
      description: 'El sistema de referidos ya se encuentra activo',
      actions: [],
      links: [
        {
          label: "Contacta con el Administrador",
          external: true,
          link: "https://wa.me/+18094659650?text=Hola!+Quiero+empezar+a+promocionar+KitMaestro.+Me+puedes+dar+un+link+de+referido?"
        }
      ],
      content: `Ahora contamos con un sistema de referidos funcional. Ya puedes referir a tus compañeros a la plataforma y ganar 20% de su suscripción a la plataforma como incentivo por recomendarnos. Para empezar solo ponte en contacto con el administrador para conseguir tu link.
Recuerda que siempre puedes realizar un reporte de error si encuentras uno, la vía más fácil es el WhatsApp del creador: +1809-465-9650`,
    },
    {
      type: 'notice',
      date: new Date(2024, 7, 20),
      author: 'Otoniel Reyes Galay',
      title: 'Unidades de Aprendizaje de Educación Artística',
      description: 'Los contenidos de Educación Artística ya están disponibles',
      actions: [],
      content: `Ya se han añadido todos los contenidos correspondientes al primer y segundo ciclo de educación primaria de Educación Artística. A pesar de que esperábamos poder subir primero Matemática y Ciencias Naturales, resultaron mucho menos los contenidos de Educación Artística, como es de suponerse, y por lo tanto, con el sistema que llevamos para subir los contenidos, se terminó primero con estos, mientras que Matemática ya se encuentra a un 33% y Ciencias Naturales se encuentra, de momento, al 20%.
De igual manera, nos es un grato placer informar que ya puedes empezar a crear tus unidades de aprendizaje de Educación Artística en la educación primaria.
Recuerda que siempre puedes realizar un reporte de error si encuentras uno, la vía más fácil es el WhatsApp del creador: +1809-465-9650`,
    },
    {
      type: 'notice',
      date: new Date(2024, 7, 19),
      author: 'Otoniel Reyes Galay',
      title: 'Unidades de Aprendizaje de Educación Física',
      description: 'Los contenidos de Educación Física ya están disponibles',
      actions: [],
      content: `El día de hoy hemos agregado todos los contenidos correspondientes al primer y segundo ciclo de educación primaria de Educación Física. De manera que ya puedes empezar a crear tus unidades de aprendizaje de Educación Física en la educación primaria.
Seguimos avanzando hacia la totalidad de los contenidos. Ya estamos trabajando con Matemáticas y Ciencias de la Naturaleza, que serán la próxima incorporación, junto a la inclusión del tan esperado sistema de referidos.
Esto significa que ya a partir de la próxima actualización, podrás referir a tus conocidos y ganar el 20% de su contribución.
Recuerda que siempre puedes realizar un reporte de error si encuentras uno, la vía más fácil es el WhatsApp del creador: +1809-465-9650`,
    },
    {
      type: 'notice',
      date: new Date(2024, 7, 18),
      author: 'Otoniel Reyes Galay',
      title: 'Unidades de Aprendizaje de Inglés',
      description: 'Los contenidos de Inglés ya están disponibles',
      actions: [],
      content: `En el día de hoy hemos incorporado los contenidos correspondientes al segundo ciclo de educación primaria de Inglés. De manera que ya puedes empezar a crear tus unidades de aprendizaje de inglés sin ningun problema, tan facil como siempre.
Repetimos que nos encontramos trabajando arduamente y sin descanso para agregar todos los contenidos mediadores y sus respectivas dependencias a la plataforma para proveerte la experiencia que tanto mereces y anhelas. No desesperes, cada vez estamos más cerca.`,
    },
    {
      type: 'notice',
      date: new Date(2024, 7, 17),
      author: 'Otoniel Reyes Galay',
      title: 'Unidades de Aprendizaje de Lengua Española y Ciencias Sociales',
      description: 'Los contenidos de Lengua y Sociales ya están en la plataforma.',
      actions: [],
      content: `Hoy le damos la bienvenida a los contenidos de primer y segundo ciclo de educación primaria de la adecuación curricular en las áreas de Lengua Española y Ciencias Sociales.
Esto significa que ya puedes generar unidades de aprendizaje completas para estas asignaturas para el nivel primario.
Nos encontramos trabajando arduamente y sin descanso para agregar todos los contenidos mediadores y sus respectivas dependencias a la plataforma para proveerte la experiencia que tanto mereces y anhelas. No desesperes, cada vez estamos más cerca.`,
    },
    {
      type: 'feature',
      date: new Date(2024, 7, 14),
      author: 'Otoniel Reyes Galay',
      title: 'Guardar y Exportar Planes',
      description: 'Los planes generados se pueden guardar y exportar',
      actions: [
        {
          label: 'Ver mis Unidades de Aprendizaje',
          link: ['/app', 'unit-plans', 'list'],
        },
        {
          label: 'Ver mis Planes Diarios',
          link: ['/app', 'class-plans', 'list'],
        },
      ],
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
        {
          label: 'Crear una Unidad de Aprendizaje',
          link: ['/app', 'unit-plans']
        },
        {
          label: 'Crear un Plan Diario',
          link: ['/app', 'class-plans']
        },
      ],
    },
  ];

  ngOnInit() {
    console.log(this.updates)
  }
}
