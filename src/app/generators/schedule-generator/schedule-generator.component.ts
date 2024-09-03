import { Component, OnInit } from '@angular/core';

interface Asignatura {
  nombre: string;
  horasSemanales: number;
  bloquesNecesarios: number; // Calculado basado en horas semanales y tipo de bloque
  sesionesPorBloque: number; // 1 o 2
}

interface Sesion {
  inicio: string;
  fin: string;
  asignatura: string;
}

interface Bloque {
  horaInicio: Date;
  horaFin: Date;
  asignaturas: Asignatura[];
}

interface Horario {
  bloques: Bloque[];
}

@Component({
  selector: 'app-schedule-generator',
  standalone: true,
  imports: [],
  templateUrl: './schedule-generator.component.html',
  styleUrl: './schedule-generator.component.scss'
})
export class ScheduleGeneratorComponent implements OnInit {
  horario: string[][] = [];

  sesiones = [
    { inicio: '08:15', fin: '09:00' },
    { inicio: '09:00', fin: '09:45' },
    { inicio: '10:15', fin: '11:00' },
    { inicio: '11:00', fin: '11:45' },
    { inicio: '12:45', fin: '01:30' },
    { inicio: '01:30', fin: '02:15' },
    { inicio: '02:30', fin: '03:15' },
    { inicio: '03:15', fin: '04:00' },
  ];

  dias = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes'
  ];

  ngOnInit() {
    this.generarHorario()
  }

  generarHorario() {
    const asignaturas: Asignatura[] = [
      { nombre: 'Lengua Española', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Matemática', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Ciencias Sociales', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Ciencias de la Naturaleza', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Inglés', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Educación Artística', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Educación Física', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Formación Integral Humana y Religiosa', horasSemanales: 7, sesionesPorBloque: 2, bloquesNecesarios: Math.ceil(7 / 2) },
      { nombre: 'Curso Optativo', horasSemanales: 4, sesionesPorBloque: 1, bloquesNecesarios: Math.ceil(4) },
    ];

    const pool = this.shuffle(asignaturas.map(a => {
      const arr = Array.from({ length: a.horasSemanales }).map(i => a.nombre);
      return arr;
    }).flat());

    this.horario.push(pool.slice(0, 5));
    this.horario.push(pool.slice(5, 10));
  }

  shuffle(array: string[]) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
